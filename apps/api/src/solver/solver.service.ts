import { Injectable } from '@nestjs/common';
import { SolverSection, SolveRequest, SolveResponse } from './types';
import { ConflictGraph } from './conflict-graph';
import { BacktrackingSearch } from './backtracking-search';

@Injectable()
export class SolverService {
  solve(
    courses: SolverSection[][],
    request: SolveRequest,
  ): SolveResponse {
    const startTime = performance.now();

    // Flatten courses into a single array for ConflictGraph
    const allSections = courses.flat();
    
    // Build the conflict graph
    const graph = new ConflictGraph(allSections);

    // Analyze Course-Level Conflicts
    const conflicts: any[] = [];
    for (let i = 0; i < courses.length; i++) {
      for (let j = i + 1; j < courses.length; j++) {
        const courseA = courses[i];
        const courseB = courses[j];
        
        let allConflict = true;
        for (const secA of courseA) {
          for (const secB of courseB) {
            if (!graph.hasConflict(secA.id, secB.id)) {
              allConflict = false;
              break;
            }
          }
          if (!allConflict) break;
        }

        if (allConflict && courseA.length > 0 && courseB.length > 0) {
          conflicts.push({
            courseA: courseA[0].courseCode,
            courseB: courseB[0].courseCode,
            reason: 'تعارض تام في الأوقات بين جميع الشعب'
          });
        }
      }
    }

    // Run the search
    const search = new BacktrackingSearch(
      courses,
      graph,
      request.hard,
      request.soft,
      request.limit,
    );
    
    const results = search.solve();
    const elapsedMs = performance.now() - startTime;

    const schedules = results.map(r => {
      return {
        score: r.metrics.score,
        daysOnCampus: r.metrics.daysOnCampus,
        totalGapMinutes: r.metrics.totalGapMinutes,
        sections: r.schedule,
      };
    });

    return {
      totalFound: results.length,
      returned: schedules.length,
      elapsedMs,
      schedules,
      conflicts
    };
  }
}
