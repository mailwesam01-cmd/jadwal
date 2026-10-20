import { Controller, Get, Post, Body, Param, NotFoundException, BadRequestException, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import type { Response } from 'express';
import * as crypto from 'crypto';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolverService } from './solver/solver.service';
import { TtuParserService } from './catalogue/ttu-parser.service';
import { University } from './catalogue/entities/university.entity';
import { Term } from './catalogue/entities/term.entity';
import { Course } from './catalogue/entities/course.entity';
import { Section } from './catalogue/entities/section.entity';
import { MeetingTime } from './catalogue/entities/meeting-time.entity';
import { SharedSchedule } from './catalogue/entities/shared-schedule.entity';
import { ActivityLog } from './catalogue/entities/activity-log.entity';
import type { SolveRequest, SolveResponse, SolverSection } from './solver/types';

@Controller('api')
export class AppController {
  constructor(
    private readonly solverService: SolverService,
    private readonly ttuParserService: TtuParserService,
    @InjectRepository(University) private univRepo: Repository<University>,
    @InjectRepository(Term) private termRepo: Repository<Term>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(Section) private sectionRepo: Repository<Section>,
    @InjectRepository(MeetingTime) private mtRepo: Repository<MeetingTime>,
    @InjectRepository(SharedSchedule) private sharedRepo: Repository<SharedSchedule>,
    @InjectRepository(ActivityLog) private logRepo: Repository<ActivityLog>,
  ) {}

  @Get('courses')
  async getCourses() {
    return this.courseRepo.find({
      relations: {
        sections: {
          meetingTimes: true
        }
      }
    });
  }

  @Post('solve')
  async solve(@Body() request: SolveRequest): Promise<SolveResponse> {
    if (!request.courseIds || request.courseIds.length === 0) {
      throw new BadRequestException('No courses provided');
    }
    
    // Fetch courses from DB
    const dbCourses = await this.courseRepo.find({
      where: request.courseIds.map(id => ({ id })),
      relations: { sections: { meetingTimes: true } }
    });

    // Map to SolverSection[][]
    const solverCourses: SolverSection[][] = dbCourses.map(course => {
      return course.sections.map(sec => ({
        id: sec.id,
        courseId: course.id,
        courseCode: course.code,
        courseName: course.nameAr,
        sectionNo: sec.sectionNo,
        instructor: sec.instructor || 'TBA',
        credits: course.creditHours,
        isOpen: sec.isOpen,
        meetingTimes: sec.meetingTimes.map(mt => ({
          dayOfWeek: mt.dayOfWeek,
          startsAt: mt.startsAt,
          endsAt: mt.endsAt,
          room: mt.room
        }))
      }));
    });
    
    const response = this.solverService.solve(solverCourses, request);
    if (response.schedules.length > 0) {
      await this.logRepo.save(this.logRepo.create({
        action: 'Generated schedules',
        university: 'TTU'
      }));
    }
    return response;
  }

  @Post('schedules/share')
  async shareSchedule(@Body() request: { termId: string, sectionIds: string[] }) {
    if (!request.sectionIds || request.sectionIds.length === 0) {
      throw new BadRequestException('No sections provided');
    }
    const slug = crypto.randomBytes(4).toString('hex'); // 8 characters
    const term = await this.termRepo.findOne({ where: { code: request.termId || 'fall2026' } });
    if (!term) throw new BadRequestException('Invalid term');

    const shared = this.sharedRepo.create({
      slug,
      term,
      sectionIds: request.sectionIds
    });
    await this.sharedRepo.save(shared);

    await this.logRepo.save(this.logRepo.create({
      action: 'Shared a schedule link',
      university: 'TTU'
    }));

    return { slug };
  }

  @Get('schedules/:slug')
  async getSharedSchedule(@Param('slug') slug: string) {
    const shared = await this.sharedRepo.findOne({ where: { slug }, relations: { term: true } });
    if (!shared) throw new NotFoundException('Schedule not found');

    // Update views
    shared.views += 1;
    await this.sharedRepo.save(shared);

    // Fetch the sections with their meeting times and courses
    const sections = await this.sectionRepo.find({
      where: shared.sectionIds.map(id => ({ id })),
      relations: { course: true, meetingTimes: true }
    });

    return {
      slug: shared.slug,
      termId: shared.term.code,
      sections: sections.map((sec, index) => ({
        id: sec.id,
        courseCode: sec.course.code,
        courseName: sec.course.nameAr,
        sectionNo: sec.sectionNo,
        instructor: sec.instructor,
        colorIndex: (index % 8) + 1, // Add standard color index
        meetingTimes: sec.meetingTimes.map(mt => ({
          dayOfWeek: mt.dayOfWeek,
          startsAt: mt.startsAt,
          endsAt: mt.endsAt,
          room: mt.room
        }))
      }))
    };
  }

  @Get('schedules/:slug/ics')
  async getSharedScheduleIcs(@Param('slug') slug: string, @Res() res: Response) {
    const shared = await this.sharedRepo.findOne({ where: { slug }, relations: { term: true } });
    if (!shared) throw new NotFoundException('Schedule not found');

    const sections = await this.sectionRepo.find({
      where: shared.sectionIds.map(id => ({ id })),
      relations: { course: true, meetingTimes: true }
    });

    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Jadwal//TTU Schedule//EN\n';

    const byDayMap = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    
    for (const sec of sections) {
      for (const mt of sec.meetingTimes) {
        icsContent += 'BEGIN:VEVENT\n';
        icsContent += `SUMMARY:${sec.course.nameAr || sec.course.code} - Sec ${sec.sectionNo}\n`;
        icsContent += `LOCATION:${mt.room}\n`;
        icsContent += `DESCRIPTION:Instructor: ${sec.instructor}\n`;
        
        const startHour = mt.startsAt.replace(':', '');
        const endHour = mt.endsAt.replace(':', '');
        
        // Assume first week of September 2026 for the start date of the first occurrence
        // Sept 1 2026 is a Tuesday. Day 0 (Sun) -> Sept 6, Day 1 -> Sept 7, etc.
        const baseDate = new Date(2026, 8, 1);
        while (baseDate.getDay() !== mt.dayOfWeek) {
          baseDate.setDate(baseDate.getDate() + 1);
        }
        
        const yyyy = baseDate.getFullYear();
        const mm = String(baseDate.getMonth() + 1).padStart(2, '0');
        const dd = String(baseDate.getDate()).padStart(2, '0');
        
        icsContent += `DTSTART;TZID=Asia/Amman:${yyyy}${mm}${dd}T${startHour}00\n`;
        icsContent += `DTEND;TZID=Asia/Amman:${yyyy}${mm}${dd}T${endHour}00\n`;
        icsContent += `RRULE:FREQ=WEEKLY;BYDAY=${byDayMap[mt.dayOfWeek]};UNTIL=20270115T235959Z\n`;
        icsContent += 'END:VEVENT\n';
      }
    }
    
    icsContent += 'END:VCALENDAR';

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="schedule-${slug}.ics"`);
    res.send(icsContent);
  }

  @Post('import/ttu')
  async importTtuCatalogue(@Body('data') text: string) {
    if (!text) throw new BadRequestException('Data is required');
    const parsedCourses = this.ttuParserService.parseTsv(text);
    return this.saveParsedCourses(parsedCourses);
  }

  @Post('import/ttu/excel')
  @UseInterceptors(FileInterceptor('file'))
  async importTtuExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    const parsedCourses = this.ttuParserService.parseExcel(file.buffer);
    return this.saveParsedCourses(parsedCourses);
  }

  private async saveParsedCourses(parsedCourses: any[]) {
    // 1. Ensure TTU exists
    let ttu = await this.univRepo.findOne({ where: { code: 'ttu' } });
    if (!ttu) {
      ttu = this.univRepo.create({ code: 'ttu', nameEn: 'TTU', nameAr: 'جامعة الطفيلة التقنية', timezone: 'Asia/Amman' });
      await this.univRepo.save(ttu);
    }

    // 2. Ensure Fall 2026 term exists
    let term = await this.termRepo.findOne({ where: { code: 'fall2026', university: { id: ttu.id } } });
    if (!term) {
      term = this.termRepo.create({
        code: 'fall2026',
        nameAr: 'الفصل الأول 2026',
        isActive: true,
        university: ttu
      });
      await this.termRepo.save(term);
    }

    // 4. Save to DB
    for (const pc of parsedCourses) {
      // Find or create Course
      let course = await this.courseRepo.findOne({ where: { code: pc.code, term: { id: term.id } } });
      if (!course) {
        course = this.courseRepo.create({
          code: pc.code,
          nameAr: pc.name,
          creditHours: pc.credits,
          term: term
        });
        await this.courseRepo.save(course);
      }

      // Save Sections
      for (const ps of pc.sections) {
        let section = await this.sectionRepo.findOne({ where: { sectionNo: ps.sectionNo, course: { id: course.id } } });
        if (!section) {
          section = this.sectionRepo.create({
            sectionNo: ps.sectionNo,
            instructor: ps.instructor,
            course: course
          });
          await this.sectionRepo.save(section);
        }

        // Save Meeting Times
        for (const mt of ps.meetingTimes) {
          // Check if exists
          let meeting = await this.mtRepo.findOne({
            where: {
              dayOfWeek: mt.dayOfWeek,
              startsAt: mt.startTime,
              endsAt: mt.endTime,
              section: { id: section.id }
            }
          });
          if (!meeting) {
            meeting = this.mtRepo.create({
              dayOfWeek: mt.dayOfWeek,
              startsAt: mt.startTime,
              endsAt: mt.endTime,
              room: mt.room || 'TBA',
              section: section
            });
            await this.mtRepo.save(meeting);
          } else if (meeting.room === 'TBA' && mt.room) {
            meeting.room = mt.room;
            await this.mtRepo.save(meeting);
          }
        }
      }
    }

    return { 
      message: 'Import successful', 
      coursesImported: parsedCourses.length 
    };
  }
}
