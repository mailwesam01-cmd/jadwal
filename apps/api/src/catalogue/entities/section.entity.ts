import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { MeetingTime } from './meeting-time.entity';

@Entity('sections')
@Unique(['courseId', 'sectionNo'])
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ name: 'course_id' })
  courseId: string;

  @Column({ name: 'section_no' })
  sectionNo: string;

  @Column({ nullable: true })
  instructor: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @Column({ type: 'int', nullable: true })
  enrolled: number;

  @Column({ name: 'is_open', default: true })
  isOpen: boolean;

  @Column({ name: 'verified_at', type: 'datetime', nullable: true })
  verifiedAt: Date;

  @OneToMany(() => MeetingTime, (meetingTime) => meetingTime.section)
  meetingTimes: MeetingTime[];
}
