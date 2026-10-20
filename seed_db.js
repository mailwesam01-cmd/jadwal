const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');

const db = new Database(path.join(__dirname, 'jadwal.sqlite'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('Seeding Jadwal database...');

// 1. Universities
const univs = [
  { id: 'univ-ttu', code: 'ttu', name_en: 'Tafila Technical University', name_ar: 'جامعة الطفيلة التقنية' },
  { id: 'univ-ju', code: 'ju', name_en: 'University of Jordan', name_ar: 'الجامعة الأردنية' },
  { id: 'univ-just', code: 'just', name_en: 'Jordan Univ of Science & Technology', name_ar: 'جامعة العلوم والتكنولوجيا الأردنية' },
  { id: 'univ-hu', code: 'hu', name_en: 'Hashemite University', name_ar: 'الجامعة الهاشمية' },
  { id: 'univ-gju', code: 'gju', name_en: 'German Jordanian University', name_ar: 'الجامعة الألمانية الأردنية' },
];

const insertUniv = db.prepare(`
  INSERT OR REPLACE INTO universities (id, code, name_en, name_ar, timezone)
  VALUES (@id, @code, @name_en, @name_ar, 'Asia/Amman')
`);

for (const u of univs) {
  insertUniv.run(u);
}

// 2. Terms
const termId = 'term-fall2026';
db.prepare(`
  INSERT OR REPLACE INTO terms (id, university_id, code, name_ar, starts_on, ends_on, is_active)
  VALUES (?, ?, 'fall2026', 'الفصل الأول 2026/2027', '2026-09-01', '2027-01-20', 1)
`).run(termId, 'univ-ttu');

// 3. Courses & Sections
const coursesData = [
  {
    code: 'MATH101',
    name_ar: 'التفاضل والتكامل (1)',
    name_en: 'Calculus I',
    credits: 3,
    sections: [
      { secNo: '1', instructor: 'د. أحمد عبيدات', times: [{ day: 0, s: '09:00', e: '10:00', r: 'قاعة 101' }, { day: 2, s: '09:00', e: '10:00', r: 'قاعة 101' }, { day: 4, s: '09:00', e: '10:00', r: 'قاعة 101' }] },
      { secNo: '2', instructor: 'د. سارة خليل', times: [{ day: 1, s: '10:00', e: '11:30', r: 'قاعة 102' }, { day: 3, s: '10:00', e: '11:30', r: 'قاعة 102' }] },
      { secNo: '3', instructor: 'د. أحمد عبيدات', times: [{ day: 0, s: '11:00', e: '12:00', r: 'مدرج 3' }, { day: 2, s: '11:00', e: '12:00', r: 'مدرج 3' }, { day: 4, s: '11:00', e: '12:00', r: 'مدرج 3' }] },
    ]
  },
  {
    code: 'CS111',
    name_ar: 'برمجة الحاسوب (1) C++',
    name_en: 'Computer Programming I',
    credits: 3,
    sections: [
      { secNo: '1', instructor: 'د. رامي النجار', times: [{ day: 1, s: '08:30', e: '10:00', r: 'مختبر 4' }, { day: 3, s: '08:30', e: '10:00', r: 'مختبر 4' }] },
      { secNo: '2', instructor: 'د. محمد علي', times: [{ day: 0, s: '10:00', e: '11:00', r: 'مختبر 2' }, { day: 2, s: '10:00', e: '11:00', r: 'مختبر 2' }, { day: 4, s: '10:00', e: '11:00', r: 'مختبر 2' }] },
      { secNo: '3', instructor: 'د. رامي النجار', times: [{ day: 0, s: '12:00', e: '13:00', r: 'مختبر 1' }, { day: 2, s: '12:00', e: '13:00', r: 'مختبر 1' }, { day: 4, s: '12:00', e: '13:00', r: 'مختبر 1' }] },
    ]
  },
  {
    code: 'PHYS101',
    name_ar: 'الفيزياء العامة (1)',
    name_en: 'General Physics I',
    credits: 3,
    sections: [
      { secNo: '1', instructor: 'د. خلدون الزعبي', times: [{ day: 0, s: '08:00', e: '09:00', r: 'قاعة 201' }, { day: 2, s: '08:00', e: '09:00', r: 'قاعة 201' }, { day: 4, s: '08:00', e: '09:00', r: 'قاعة 201' }] },
      { secNo: '2', instructor: 'د. منار الشريف', times: [{ day: 1, s: '11:30', e: '13:00', r: 'قاعة 202' }, { day: 3, s: '11:30', e: '13:00', r: 'قاعة 202' }] },
    ]
  },
  {
    code: 'CS212',
    name_ar: 'تراكيب البيانات والخوارزميات',
    name_en: 'Data Structures & Algorithms',
    credits: 3,
    sections: [
      { secNo: '1', instructor: 'د. طارق الحنيطي', times: [{ day: 1, s: '10:00', e: '11:30', r: 'مختبر 5' }, { day: 3, s: '10:00', e: '11:30', r: 'مختبر 5' }] },
      { secNo: '2', instructor: 'د. طارق الحنيطي', times: [{ day: 0, s: '09:00', e: '10:00', r: 'قاعة 105' }, { day: 2, s: '09:00', e: '10:00', r: 'قاعة 105' }, { day: 4, s: '09:00', e: '10:00', r: 'قاعة 105' }] },
    ]
  },
  {
    code: 'CS342',
    name_ar: 'أنظمة قواعد البيانات',
    name_en: 'Database Systems',
    credits: 3,
    sections: [
      { secNo: '1', instructor: 'د. إيمان العمري', times: [{ day: 0, s: '10:00', e: '11:00', r: 'قاعة 301' }, { day: 2, s: '10:00', e: '11:00', r: 'قاعة 301' }, { day: 4, s: '10:00', e: '11:00', r: 'قاعة 301' }] },
      { secNo: '2', instructor: 'د. إيمان العمري', times: [{ day: 1, s: '13:00', e: '14:30', r: 'مختبر 3' }, { day: 3, s: '13:00', e: '14:30', r: 'مختبر 3' }] },
    ]
  },
  {
    code: 'ENG101',
    name_ar: 'مهارات الاتصال باللغة الإنجليزية',
    name_en: 'English Communication Skills',
    credits: 3,
    sections: [
      { secNo: '1', instructor: 'أ. دانا العبداللات', times: [{ day: 1, s: '08:30', e: '10:00', r: 'قاعة 104' }, { day: 3, s: '08:30', e: '10:00', r: 'قاعة 104' }] },
      { secNo: '2', instructor: 'أ. دانا العبداللات', times: [{ day: 0, s: '13:00', e: '14:00', r: 'قاعة 104' }, { day: 2, s: '13:00', e: '14:00', r: 'قاعة 104' }, { day: 4, s: '13:00', e: '14:00', r: 'قاعة 104' }] },
    ]
  },
  {
    code: 'AI301',
    name_ar: 'مقدمة في الذكاء الاصطناعي',
    name_en: 'Introduction to AI',
    credits: 3,
    sections: [
      { secNo: '1', instructor: 'د. وسام المجالي', times: [{ day: 0, s: '11:00', e: '12:00', r: 'قاعة الذكاء' }, { day: 2, s: '11:00', e: '12:00', r: 'قاعة الذكاء' }, { day: 4, s: '11:00', e: '12:00', r: 'قاعة الذكاء' }] },
      { secNo: '2', instructor: 'د. وسام المجالي', times: [{ day: 1, s: '11:30', e: '13:00', r: 'مختبر الروبوتات' }, { day: 3, s: '11:30', e: '13:00', r: 'مختبر الروبوتات' }] },
    ]
  }
];

const insertCourse = db.prepare(`
  INSERT OR REPLACE INTO courses (id, term_id, code, name_en, name_ar, credit_hours, department)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertSection = db.prepare(`
  INSERT OR REPLACE INTO sections (id, course_id, section_no, instructor, capacity, enrolled, is_open)
  VALUES (?, ?, ?, ?, 40, 25, 1)
`);

const insertMeetingTime = db.prepare(`
  INSERT OR REPLACE INTO meeting_times (id, section_id, day_of_week, starts_at, ends_at, room)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const demoSectionIds = [];

for (const c of coursesData) {
  const courseId = `course-${c.code.toLowerCase()}`;
  insertCourse.run(courseId, termId, c.code, c.name_en, c.name_ar, c.credits, 'Computer Science & Engineering');

  for (const s of c.sections) {
    const secId = `sec-${c.code.toLowerCase()}-${s.secNo}`;
    insertSection.run(secId, courseId, s.secNo, s.instructor);
    
    if (s.secNo === '1' && demoSectionIds.length < 5) {
      demoSectionIds.push(secId);
    }

    let mtIndex = 1;
    for (const mt of s.times) {
      const mtId = `mt-${secId}-${mtIndex++}`;
      insertMeetingTime.run(mtId, secId, mt.day, mt.s, mt.e, mt.r);
    }
  }
}

// 4. Shared Schedule demo
db.prepare(`
  INSERT OR REPLACE INTO shared_schedules (slug, sectionIds, views, term_id)
  VALUES (?, ?, ?, ?)
`).run('demo-schedule', JSON.stringify(demoSectionIds), 42, termId);

// 5. Activity logs
const logs = [
  { action: 'Generated schedules (Calculus + CS + Physics)', university: 'TTU' },
  { action: 'Shared a schedule link (demo-schedule)', university: 'TTU' },
  { action: 'Exported calendar to ICS', university: 'JUST' },
  { action: 'Generated conflict-free timetable (5 courses)', university: 'JU' },
  { action: 'Updated catalogue data via Excel', university: 'TTU' },
];

const insertLog = db.prepare(`
  INSERT INTO activity_logs (action, university) VALUES (?, ?)
`);
for (const l of logs) {
  insertLog.run(l.action, l.university);
}

console.log('Seeding completed successfully!');
