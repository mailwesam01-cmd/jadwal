import type { GridSection } from '../components/ScheduleGrid';

export const exportToICS = (sections: GridSection[]) => {
  if (!sections || sections.length === 0) return;

  let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Jadwal//TTU Schedule//AR\n";
  
  // Mapping our days (0=Sun, 1=Mon, etc.) to ICS days
  const rruleDays = ['SU', 'MO', 'TU', 'WE', 'TH'];
  
  // Base date (Let's pick a random Sunday in the future or standard semester start)
  // For demonstration, we'll just use the upcoming week's dates
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sun
  
  sections.forEach(section => {
    section.meetingTimes.forEach(mt => {
      // Calculate the next occurrence of this day
      const diff = mt.dayOfWeek - currentDay;
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + (diff >= 0 ? diff : diff + 7));
      
      const [startH, startM] = mt.startsAt.split(':').map(Number);
      const [endH, endM] = mt.endsAt.split(':').map(Number);
      
      const startDate = new Date(nextDate);
      startDate.setHours(startH, startM, 0);
      
      const endDate = new Date(nextDate);
      endDate.setHours(endH, endM, 0);
      
      const formatICSDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      icsContent += "BEGIN:VEVENT\n";
      icsContent += `SUMMARY:${section.courseCode} - ${section.sectionNo}\n`;
      icsContent += `DESCRIPTION:Instructor: ${section.instructor}\\nCourse: ${section.courseCode}\n`;
      icsContent += `LOCATION:${mt.room}\n`;
      icsContent += `DTSTART:${formatICSDate(startDate)}\n`;
      icsContent += `DTEND:${formatICSDate(endDate)}\n`;
      icsContent += `RRULE:FREQ=WEEKLY;BYDAY=${rruleDays[mt.dayOfWeek]};COUNT=16\n`; // 16 weeks typical semester
      icsContent += "END:VEVENT\n";
    });
  });

  icsContent += "END:VCALENDAR\n";

  // Trigger download
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'jadwal-schedule.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
