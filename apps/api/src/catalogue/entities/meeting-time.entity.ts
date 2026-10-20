import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Section } from './section.entity';

@Entity('meeting_times')
@Index('ix_meeting_section', ['sectionId'])
export class MeetingTime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Section, (section) => section.meetingTimes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @Column({ name: 'section_id' })
  sectionId: string;

  @Column({ name: 'day_of_week', type: 'int' })
  dayOfWeek: number;

  @Column({ name: 'starts_at', type: 'varchar' })
  startsAt: string;

  @Column({ name: 'ends_at', type: 'varchar' })
  endsAt: string;

  @Column({ nullable: true })
  room: string;
}
