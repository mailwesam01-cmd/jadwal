import { Injectable, Logger } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { Course } from './entities/course.entity';
import { Section } from './entities/section.entity';
import { MeetingTime } from './entities/meeting-time.entity';

// Temporary DTOs for the parser output
export interface ParsedCourse {
  code: string;
  name: string;
  credits: number;
  sections: ParsedSection[];
}

export interface ParsedSection {
  sectionNo: string;
  instructor: string;
  meetingTimes: ParsedMeetingTime[];
}

export interface ParsedMeetingTime {
  dayOfWeek: number;
  startTime: string; // HH:mm format
  endTime: string;
  room?: string;
}

@Injectable()
export class TtuParserService {
  private readonly logger = new Logger(TtuParserService.name);

  /**
   * Parses an uploaded Excel file (.xlsx or .xls)
   */
  public parseExcel(buffer: Buffer): ParsedCourse[] {
    try {
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert sheet to 2D array
      const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][];
      
      // Find header row index
      let headerRowIndex = -1;
      for (let i = 0; i < Math.min(20, rows.length); i++) {
        const rowString = rows[i].join(' ');
        if (rowString.includes('رقم المادة') || rowString.includes('الوقت')) {
          headerRowIndex = i;
          break;
        }
      }

      if (headerRowIndex === -1) {
        throw new Error('لم يتم العثور على عناوين الأعمدة (رقم المادة، الأيام، إلخ) في الملف.');
      }

      const headers = rows[headerRowIndex].map(h => String(h).trim());
      const colMap = {
        code: headers.findIndex(h => h.includes('رقم المادة')),
        name: headers.findIndex(h => h.includes('اسم المادة')),
        sectionNo: headers.findIndex(h => h.includes('رقم التسجيل') || h.includes('الشعبة')),
        credits: headers.findIndex(h => h.includes('س.م')),
        time: headers.findIndex(h => h.includes('الوقت')),
        days: headers.findIndex(h => h.includes('الأيام')),
        room: headers.findIndex(h => h.includes('القاعة')),
        instructor: headers.findIndex(h => h.includes('اسم المدرس'))
      };

      const coursesMap = new Map<string, ParsedCourse>();

      for (let i = headerRowIndex + 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 5) continue; // skip empty rows

        const codeStr = String(row[colMap.code] || '').trim();
        if (!codeStr || codeStr === '') continue;

        const timeStr = String(row[colMap.time] || '').trim();
        const daysStr = String(row[colMap.days] || '').trim();
        if (!timeStr || !daysStr || daysStr.includes('مجهول')) continue;

        const name = String(row[colMap.name] || 'مادة مجهولة').trim();
        const sectionNo = String(row[colMap.sectionNo] || '1').trim();
        const instructor = String(row[colMap.instructor] || 'غير محدد').trim();
        const credits = parseInt(String(row[colMap.credits] || '3'), 10) || 3;
        const room = String(row[colMap.room] || '').trim();

        // Parse Time (e.g. 10:00 AM - 11:30 AM or 10:00 AM-)
        let start = '08:00';
        let end = '09:30';
        
        const timeParts = timeStr.split('-');
        if (timeParts.length >= 1 && timeParts[0].trim()) {
          start = this.normalizeTime(timeParts[0].trim());
          if (timeParts.length >= 2 && timeParts[1].trim()) {
            end = this.normalizeTime(timeParts[1].trim());
          } else {
            // If end time is missing, assume +1.5 hours
            const [sh, sm] = start.split(':').map(Number);
            const endDate = new Date();
            endDate.setHours(sh, sm + 90, 0);
            end = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
          }
        }

        const dayIndices = this.parseArabicDays(daysStr);
        if (dayIndices.length === 0) continue;

        let course = coursesMap.get(codeStr);
        if (!course) {
          course = { code: codeStr, name, credits, sections: [] };
          coursesMap.set(codeStr, course);
        }

        let section = course.sections.find(s => s.sectionNo === sectionNo);
        if (!section) {
          section = { sectionNo, instructor, meetingTimes: [] };
          course.sections.push(section);
        }

        // Add meeting times
        for (const day of dayIndices) {
          section.meetingTimes.push({
            dayOfWeek: day,
            startTime: start,
            endTime: end,
            room: room
          });
        }
      }

      return Array.from(coursesMap.values());
    } catch (err) {
      this.logger.error('Failed to parse Excel file', err);
      throw new Error('Invalid Excel file');
    }
  }

  /**
   * Parses text copied from the TTU student portal (TSV format usually)
   * Expected columns: Course Code, Course Name, Credits, Section No, Days, Time, Room, Instructor
   * The order doesn't strictly matter if we use some heuristics, but let's assume a standard tab-separated row.
   */
  public parseTsv(text: string): ParsedCourse[] {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    const coursesMap = new Map<string, ParsedCourse>();

    for (const line of lines) {
      // Typically: [Code] [Name] [Section] [Credits] [Days] [Time] [Instructor]
      const cols = line.split('\t').map(c => c.trim());
      if (cols.length < 5) continue; // Skip malformed lines or headers

      try {
        // We'll use heuristics to find the right columns
        const code = cols.find(c => /^[A-Z]+\d+$/i.test(c.replace(/\s+/g, ''))) || cols[0];
        const sectionNo = cols.find(c => /^\d{1,2}$/.test(c)) || cols[2];
        const timeStr = cols.find(c => /\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/.test(c));
        const daysStr = cols.find(c => /^[حاثنرم]+$/.test(c.replace(/\s/g, '')) || /^[UuMmTtWwRrHh]+$/.test(c));
        
        // Find the longest string that's not code, time, or days to be the name
        const nameCandidates = cols.filter(c => c !== code && c !== sectionNo && c !== timeStr && c !== daysStr && !/^\d$/.test(c));
        const name = nameCandidates.length > 0 ? nameCandidates[0] : 'مادة مجهولة';
        const instructor = nameCandidates.length > 1 ? nameCandidates[nameCandidates.length - 1] : 'غير محدد';
        
        const creditsCol = cols.find(c => /^\d$/.test(c) && c !== sectionNo);
        const credits = creditsCol ? parseInt(creditsCol, 10) : 3;

        if (!timeStr || !daysStr) {
          continue; // Cannot schedule without time and days
        }

        // Parse Time (e.g. 08:00 - 09:30 or 8:00-9:30)
        const [start, end] = timeStr.split('-').map(t => this.normalizeTime(t.trim()));

        // Parse Days (ح: Sun=0, ن: Mon=1, ث: Tue=2, ر: Wed=3, خ: Thu=4)
        const dayIndices = this.parseArabicDays(daysStr);

        let course = coursesMap.get(code);
        if (!course) {
          course = { code, name, credits, sections: [] };
          coursesMap.set(code, course);
        }

        let section = course.sections.find(s => s.sectionNo === sectionNo);
        if (!section) {
          section = { sectionNo, instructor, meetingTimes: [] };
          course.sections.push(section);
        }

        // Add meeting times
        for (const day of dayIndices) {
          section.meetingTimes.push({
            dayOfWeek: day,
            startTime: start,
            endTime: end
          });
        }
      } catch (err) {
        this.logger.warn(`Failed to parse line: ${line}`);
      }
    }

    return Array.from(coursesMap.values());
  }

  private normalizeTime(time: string): string {
    // Expected format: "10:00 AM" or "01:30 PM" or "13:30"
    let hStr = '0';
    let mStr = '00';
    
    // Extract numbers
    const timeMatch = time.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      hStr = timeMatch[1];
      mStr = timeMatch[2];
    }

    let hour = parseInt(hStr, 10);
    const minute = parseInt(mStr, 10);

    const isPM = /pm|م/i.test(time);
    const isAM = /am|ص/i.test(time);

    if (isPM && hour < 12) {
      hour += 12;
    } else if (isAM && hour === 12) {
      hour = 0;
    } else if (!isPM && !isAM) {
      // Implicit PM heuristic (if hour is 1-7 without AM/PM)
      if (hour >= 1 && hour <= 7) {
        hour += 12;
      }
    }
    
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  private parseArabicDays(daysStr: string): number[] {
    const indices: number[] = [];
    const charMap: Record<string, number> = {
      'ح': 0, 'ا': 0, // الأحد
      'ن': 1, 'إ': 1, // الإثنين
      'ث': 2,         // الثلاثاء
      'ر': 3, 'أ': 3, // الأربعاء
      'خ': 4,         // الخميس
    };

    for (const char of daysStr) {
      if (charMap[char] !== undefined && !indices.includes(charMap[char])) {
        indices.push(charMap[char]);
      }
    }
    return indices.sort();
  }
}
