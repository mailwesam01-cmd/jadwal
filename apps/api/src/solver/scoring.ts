import { SoftConstraints, SolverSection } from './types';
import { parseTime } from './conflict-graph';

export function calculateScore(
  schedule: SolverSection[],
  soft: SoftConstraints,
): { score: number; daysOnCampus: number; totalGapMinutes: number } {
  let totalGapMinutes = 0;
  let minPossibleDays = 0; // In a more advanced implementation, this would be computed
  let daysOnCampus = 0;
  let lecturesBeforeEarly = 0;
  let lecturesAfterLate = 0;
  let sectionsWithPreferredInstructor = 0;

  const days: { [day: number]: { start: number; end: number }[] } = {};

  const preferredEarliestNum = soft.preferredEarliest ? parseTime(soft.preferredEarliest) : 0;
  const preferredLatestNum = soft.preferredLatest ? parseTime(soft.preferredLatest) : 24 * 60;

  for (const section of schedule) {
    if (soft.preferredInstructors?.includes(section.instructor)) {
      sectionsWithPreferredInstructor++;
    }

    for (const mt of section.meetingTimes) {
      if (!days[mt.dayOfWeek]) {
        days[mt.dayOfWeek] = [];
        daysOnCampus++;
      }
      const start = parseTime(mt.startsAt);
      const end = parseTime(mt.endsAt);
      days[mt.dayOfWeek].push({ start, end });

      if (start < preferredEarliestNum) {
        lecturesBeforeEarly++;
      }
      if (end > preferredLatestNum) {
        lecturesAfterLate++;
      }
    }
  }

  // Calculate gaps
  for (const dayStr in days) {
    const dayClasses = days[dayStr].sort((a, b) => a.start - b.start);
    for (let i = 1; i < dayClasses.length; i++) {
      const gap = dayClasses[i].start - dayClasses[i - 1].end;
      if (gap > 0) {
        totalGapMinutes += gap;
      }
    }
  }

  let score = 100;
  score -= (totalGapMinutes / 30) * soft.weights.gap;
  score -= (daysOnCampus - minPossibleDays) * soft.weights.days;
  score -= lecturesBeforeEarly * soft.weights.early;
  score -= lecturesAfterLate * soft.weights.late;
  score += sectionsWithPreferredInstructor * soft.weights.instructor;

  return {
    score,
    daysOnCampus,
    totalGapMinutes,
  };
}
