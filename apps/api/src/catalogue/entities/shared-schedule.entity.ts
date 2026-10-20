import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Term } from './term.entity';

@Entity('shared_schedules')
export class SharedSchedule {
  @PrimaryColumn('text')
  slug: string;

  @ManyToOne(() => Term)
  @JoinColumn({ name: 'term_id' })
  term: Term;

  @Column('simple-array')
  sectionIds: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ default: 0 })
  views: number;
}
