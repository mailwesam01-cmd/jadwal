import { SolverSection, TimeWindow } from './types';

// Converts "HH:mm" to minutes since midnight for easy comparison
export function parseTime(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function doWindowsOverlap(w1: TimeWindow, w2: TimeWindow): boolean {
  if (w1.dayOfWeek !== w2.dayOfWeek) return false;
  const start1 = parseTime(w1.startsAt);
  const end1 = parseTime(w1.endsAt);
  const start2 = parseTime(w2.startsAt);
  const end2 = parseTime(w2.endsAt);

  // If one window starts exactly when the other ends, it's typically fine for university classes,
  // but strictly checking overlap means start1 < end2 && start2 < end1.
  return start1 < end2 && start2 < end1;
}

export function doSectionsConflict(s1: SolverSection, s2: SolverSection): boolean {
  for (const m1 of s1.meetingTimes) {
    for (const m2 of s2.meetingTimes) {
      if (doWindowsOverlap(m1, m2)) {
        return true;
      }
    }
  }
  return false;
}

export class ConflictGraph {
  // adjacency list: section_id -> list of conflicting section_ids
  private graph: Map<string, Set<string>> = new Map();

  constructor(sections: SolverSection[]) {
    // Build the graph
    for (let i = 0; i < sections.length; i++) {
      this.graph.set(sections[i].id, new Set());
    }

    for (let i = 0; i < sections.length; i++) {
      for (let j = i + 1; j < sections.length; j++) {
        if (doSectionsConflict(sections[i], sections[j])) {
          this.graph.get(sections[i].id)!.add(sections[j].id);
          this.graph.get(sections[j].id)!.add(sections[i].id);
        }
      }
    }
  }

  hasConflict(sectionId1: string, sectionId2: string): boolean {
    return this.graph.get(sectionId1)?.has(sectionId2) ?? false;
  }
}
