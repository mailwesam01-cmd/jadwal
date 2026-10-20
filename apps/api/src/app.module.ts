import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AdminController } from './admin.controller';
import { AppService } from './app.service';
import { CatalogueModule } from './catalogue/catalogue.module';
import { SolverModule } from './solver/solver.module';
import { University } from './catalogue/entities/university.entity';
import { Term } from './catalogue/entities/term.entity';
import { Course } from './catalogue/entities/course.entity';
import { Section } from './catalogue/entities/section.entity';
import { MeetingTime } from './catalogue/entities/meeting-time.entity';
import { SharedSchedule } from './catalogue/entities/shared-schedule.entity';
import { ActivityLog } from './catalogue/entities/activity-log.entity';
import { Admin } from './catalogue/entities/admin.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3' as any,
      database: 'jadwal.sqlite',
      entities: [University, Term, Course, Section, MeetingTime, SharedSchedule, ActivityLog, Admin],
      synchronize: true, // Use only for dev/Phase 1
    }),
    CatalogueModule,
    SolverModule,
  ],
  controllers: [AppController, AdminController],
  providers: [AppService],
})
export class AppModule {}
