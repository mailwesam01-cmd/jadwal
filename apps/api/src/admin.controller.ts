import { Controller, Get, Post, Body, UnauthorizedException, UseGuards, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { University } from './catalogue/entities/university.entity';
import { Course } from './catalogue/entities/course.entity';
import { SharedSchedule } from './catalogue/entities/shared-schedule.entity';
import { ActivityLog } from './catalogue/entities/activity-log.entity';
import { Admin } from './catalogue/entities/admin.entity';
import { AdminAuthGuard } from './admin.guard';

@Controller('api/admin')
export class AdminController implements OnModuleInit {
  constructor(
    @InjectRepository(University) private univRepo: Repository<University>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(SharedSchedule) private sharedRepo: Repository<SharedSchedule>,
    @InjectRepository(ActivityLog) private logRepo: Repository<ActivityLog>,
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
  ) {}

  async onModuleInit() {
    const adminCount = await this.adminRepo.count();
    if (adminCount === 0) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      const defaultAdmin = this.adminRepo.create({
        username: 'admin',
        passwordHash
      });
      await this.adminRepo.save(defaultAdmin);
    }
  }

  @Post('login')
  async login(@Body('password') password: string) {
    const adminUser = await this.adminRepo.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
      throw new UnauthorizedException('Admin user not found');
    }
    
    const isMatch = await bcrypt.compare(password, adminUser.passwordHash);
    if (isMatch) {
      return { token: 'jadwal-admin-secret-token' };
    }
    throw new UnauthorizedException('Invalid password');
  }

  @UseGuards(AdminAuthGuard)
  @Get('stats')
  async getStats() {
    const totalUniversities = await this.univRepo.count();
    const totalCourses = await this.courseRepo.count();
    
    // We will do aggregate queries for schedules and views
    const allSchedules = await this.sharedRepo.find();
    const totalSharedSchedules = allSchedules.length;
    const totalViews = allSchedules.reduce((sum, sch) => sum + sch.views, 0);

    // Mock data for the last 7 days of traffic
    const trafficLast7Days = [
      { day: 'Mon', visits: 1200 },
      { day: 'Tue', visits: 1540 },
      { day: 'Wed', visits: 3100 }, // Peak registration
      { day: 'Thu', visits: 2800 },
      { day: 'Fri', visits: 900 },
      { day: 'Sat', visits: 1100 },
      { day: 'Sun', visits: 1800 },
    ];

    const recentActivityRecords = await this.logRepo.find({
      order: { createdAt: 'DESC' },
      take: 10
    });

    const recentActivity = recentActivityRecords.map(a => ({
      id: a.id,
      action: a.action,
      university: a.university,
      time: a.createdAt
    }));

    return {
      totalUniversities,
      totalCourses,
      totalSharedSchedules,
      totalViews,
      trafficLast7Days,
      recentActivity,
    };
  }

  @UseGuards(AdminAuthGuard)
  @Get('universities')
  async getUniversities() {
    return this.univRepo.find({ order: { nameAr: 'ASC' } });
  }

  @UseGuards(AdminAuthGuard)
  @Get('schedules')
  async getSchedules() {
    return this.sharedRepo.find({ order: { views: 'DESC' } });
  }
}
