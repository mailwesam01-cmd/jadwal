import { ConflictGraph, doWindowsOverlap } from './conflict-graph';
import { calculateScore } from './scoring';
import { HardConstraints, SoftConstraints, SolverSection } from './types';

export class BacktrackingSearch {
  private foundSchedules: Array<{ schedule: SolverSection[]; metrics: any }> = [];
  private limit: number;

  constructor(
    private courses: SolverSection[][],
    private graph: ConflictGraph,
    private hard: HardConstraints,
    private soft: SoftConstraints,
    limit: number,
  ) {
    this.limit = limit || 20; // Soft limit, we can just sort all found
  }

  solve(): Array<{ schedule: SolverSection[]; metrics: any }> {
    this.foundSchedules = [];
    this.backtrack(0, [], 0);

    // Sort by score descending
    this.foundSchedules.sort((a, b) => b.metrics.score - a.metrics.score);
    
    // De-duplicate schedules (optional, but good for safety)
    const unique = [];
    const seen = new Set();
    for (const s of this.foundSchedules) {
      const hash = s.schedule.map(x => x.id).sort().join(',');
      if (!seen.has(hash)) {
        seen.add(hash);
        unique.push(s);
        if (unique.length >= this.limit) break;
      }
    }
    
    return unique;
  }

  private backtrack(courseIndex: number, currentSchedule: SolverSection[], currentCredits: number) {
    if (currentCredits > (this.hard.maxCredits || 18)) {
      return; // Prune branch early if exceeding max credits
    }

    // If we have considered all courses
    if (courseIndex === this.courses.length) {
      const minC = this.hard.minCredits || 12;
      const maxC = this.hard.maxCredits || 18;
      
      if (currentCredits >= minC && currentCredits <= maxC) {
        const metrics = calculateScore(currentSchedule, this.soft);
        // Heavily favor schedules with more credits
        metrics.score += (currentCredits * 50);
        this.foundSchedules.push({ schedule: [...currentSchedule], metrics });
      }
      return;
    }

    // Branch 1: Skip this course entirely
    this.backtrack(courseIndex + 1, currentSchedule, currentCredits);

    // Branch 2: Pick one section from this course
    const courseSections = this.courses[courseIndex];
    for (const section of courseSections) {
      if (!this.hard.includeFullSections && !section.isOpen) {
        continue;
      }

      // Check hard constraints (Blocked Windows)
      let conflictsWithBlocked = false;
      for (const blocked of this.hard.blockedWindows || []) {
        for (const mt of section.meetingTimes) {
          if (doWindowsOverlap(mt, blocked)) {
            conflictsWithBlocked = true;
            break;
          }
        }
        if (conflictsWithBlocked) break;
      }
      if (conflictsWithBlocked) continue;

      // Check graph conflicts with currently selected sections
      let hasConflict = false;
      for (const selectedSection of currentSchedule) {
        if (this.graph.hasConflict(section.id, selectedSection.id)) {
          hasConflict = true;
          break;
        }
      }

      if (!hasConflict) {
        currentSchedule.push(section);
        this.backtrack(courseIndex + 1, currentSchedule, currentCredits + (section.credits || 3));
        currentSchedule.pop();
      }
    }
  }
}
