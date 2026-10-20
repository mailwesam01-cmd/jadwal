import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { University } from './university.entity';

@Entity('terms')
export class Term {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => University)
  @JoinColumn({ name: 'university_id' })
  university: University;

  @Column({ name: 'university_id' })
  universityId: string;

  @Column()
  code: string;

  @Column({ name: 'name_ar' })
  nameAr: string;

  @Column({ type: 'date', name: 'starts_on', nullable: true })
  startsOn: Date;

  @Column({ type: 'date', name: 'ends_on', nullable: true })
  endsOn: Date;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;
}
