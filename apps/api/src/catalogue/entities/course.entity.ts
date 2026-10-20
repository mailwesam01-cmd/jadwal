import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, OneToMany } from 'typeorm';
import { Term } from './term.entity';
import { Section } from './section.entity';

@Entity('courses')
@Unique(['termId', 'code'])
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Term)
  @JoinColumn({ name: 'term_id' })
  term: Term;

  @Column({ name: 'term_id' })
  termId: string;

  @Column()
  code: string;

  @Column({ name: 'name_en', nullable: true })
  nameEn: string;

  @Column({ name: 'name_ar' })
  nameAr: string;

  @Column({ name: 'credit_hours', type: 'int' })
  creditHours: number;

  @Column({ nullable: true })
  department: string;

  @OneToMany(() => Section, (section) => section.course)
  sections: Section[];
}
