export interface TimeWindow {
  dayOfWeek: number;
  startsAt: string; // "HH:mm"
  endsAt: string; // "HH:mm"
}

export interface SolverSection {
  id: string;
  courseId: string;
  courseCode: string;
  courseName?: string;
  sectionNo: string;
  instructor: string;
  credits: number;
  isOpen: boolean;
  meetingTimes: TimeWindow[];
}

export interface HardConstraints {
  blockedWindows: TimeWindow[];
  includeFullSections: boolean;
  minCredits: number;
  maxCredits: number;
}

export interface SoftConstraints {
  preferredEarliest?: string;
  preferredLatest?: string;
  preferredInstructors: string[];
  weights: {
    gap: number;
    days: number;
    early: number;
    late: number;
    instructor: number;
  };
}

export interface SolveRequest {
  termId: string;
  courseIds: string[];
  hard: HardConstraints;
  soft: SoftConstraints;
  limit: number;
}

export interface ScheduleMetrics {
  score: number;
  daysOnCampus: number;
  totalGapMinutes: number;
  sections: Array<{
    courseCode: string;
    sectionNo: string;
    instructor: string;
  }>;
}

export interface CourseConflictInfo {
  courseA: string;
  courseB: string;
  reason: string;
}

export interface SolveResponse {
  totalFound: number;
  returned: number;
  elapsedMs: number;
  schedules: ScheduleMetrics[];
  conflicts: CourseConflictInfo[];
}
