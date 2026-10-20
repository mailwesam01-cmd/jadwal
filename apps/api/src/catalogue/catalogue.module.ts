import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { University } from './entities/university.entity';
import { Term } from './entities/term.entity';
import { Course } from './entities/course.entity';
import { Section } from './entities/section.entity';
import { MeetingTime } from './entities/meeting-time.entity';
import { SharedSchedule } from './entities/shared-schedule.entity';
import { ActivityLog } from './entities/activity-log.entity';
import { Admin } from './entities/admin.entity';
import { TtuParserService } from './ttu-parser.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([University, Term, Course, Section, MeetingTime, SharedSchedule, ActivityLog, Admin]),
  ],
  providers: [TtuParserService],
  exports: [TypeOrmModule, TtuParserService],
})
export class CatalogueModule {}
