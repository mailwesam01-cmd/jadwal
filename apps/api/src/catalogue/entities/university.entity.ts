import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('universities')
export class University {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ name: 'name_en' })
  nameEn: string;

  @Column({ name: 'name_ar' })
  nameAr: string;

  @Column({ default: 'Asia/Amman' })
  timezone: string;
}
