import 'package:flutter/material.dart';
import '../models/schedule.dart';

class ScheduleGrid extends StatelessWidget {
  final Schedule schedule;

  const ScheduleGrid({Key? key, required this.schedule}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 5 days (Sun, Mon, Tue, Wed, Thu)
    final days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
    final startHour = 8;
    final endHour = 18;
    final totalHours = endHour - startHour;

    return LayoutBuilder(
      builder: (context, constraints) {
        final timeColumnWidth = 45.0;
        final gridWidth = constraints.maxWidth - timeColumnWidth;
        final dayWidth = gridWidth / 5;
        final hourHeight = 50.0;
        final gridHeight = totalHours * hourHeight;

        return SizedBox(
          height: gridHeight + 30, // Extra space for header
          child: Column(
            children: [
              // Days Header
              Row(
                children: [
                  SizedBox(width: timeColumnWidth),
                  ...days.map((day) => SizedBox(
                    width: dayWidth,
                    child: Center(
                      child: Text(
                        day,
                        style: const TextStyle(
                          color: Colors.white70,
                          fontWeight: FontWeight.bold,
                          fontSize: 11,
                        ),
                      ),
                    ),
                  )),
                ],
              ),
              const SizedBox(height: 8),
              // Grid Body
              Expanded(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  child: SizedBox(
                    height: gridHeight,
                    child: Row(
                      children: [
                        // Time Column
                        SizedBox(
                          width: timeColumnWidth,
                          child: Column(
                            children: List.generate(totalHours, (index) {
                              final hour = startHour + index;
                              return SizedBox(
                                height: hourHeight,
                                child: Align(
                                  alignment: Alignment.topCenter,
                                  child: Text(
                                    '$hour:00',
                                    style: const TextStyle(
                                      color: Colors.white30,
                                      fontSize: 10,
                                    ),
                                  ),
                                ),
                              );
                            }),
                          ),
                        ),
                        // Main Grid Stack
                        Expanded(
                          child: Stack(
                            children: [
                              // Grid Lines Horizontal
                              ...List.generate(totalHours + 1, (index) {
                                return Positioned(
                                  top: index * hourHeight,
                                  left: 0,
                                  right: 0,
                                  child: Container(
                                    height: 1,
                                    color: Colors.white.withOpacity(0.05),
                                  ),
                                );
                              }),
                              // Grid Lines Vertical
                              ...List.generate(6, (index) {
                                return Positioned(
                                  top: 0,
                                  bottom: 0,
                                  right: index * dayWidth, // RTL layout
                                  child: Container(
                                    width: 1,
                                    color: Colors.white.withOpacity(0.05),
                                  ),
                                );
                              }),
                              // Course Blocks
                              ..._buildCourseBlocks(dayWidth, hourHeight, startHour),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  List<Widget> _buildCourseBlocks(double dayWidth, double hourHeight, int startHour) {
    List<Widget> blocks = [];

    for (var section in schedule.sections) {
      for (var meeting in section.meetingTimes) {
        if (meeting.dayOfWeek > 4) continue; // Skip if Friday/Saturday

        final startParts = meeting.startsAt.split(':');
        final endParts = meeting.endsAt.split(':');
        if (startParts.length < 2 || endParts.length < 2) continue;

        final startTotalHours = int.parse(startParts[0]) + (int.parse(startParts[1]) / 60.0);
        final endTotalHours = int.parse(endParts[0]) + (int.parse(endParts[1]) / 60.0);

        // Skip if outside grid bounds
        if (endTotalHours <= startHour || startTotalHours >= 18) continue;

        final topOffset = (startTotalHours - startHour) * hourHeight;
        final blockHeight = (endTotalHours - startTotalHours) * hourHeight;
        
        final color = Colors.primaries[section.colorIndex % Colors.primaries.length];

        blocks.add(
          Positioned(
            top: topOffset,
            right: meeting.dayOfWeek * dayWidth, // RTL: Sunday(0) is on the right
            width: dayWidth,
            height: blockHeight,
            child: Container(
              margin: const EdgeInsets.all(1.0),
              decoration: BoxDecoration(
                color: color.withOpacity(0.25),
                border: Border.all(color: color.withOpacity(0.8), width: 1.5),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      section.courseName.isNotEmpty ? section.courseName : section.courseCode,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
                        fontSize: 10,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.clip,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${meeting.startsAt} - ${meeting.endsAt}',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.9),
                        fontSize: 8,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.clip,
                    ),
                    if (meeting.room.isNotEmpty && meeting.room != 'TBA') ...[
                      const SizedBox(height: 2),
                      Text(
                        meeting.room,
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.7),
                          fontSize: 8,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.clip,
                      ),
                    ]
                  ],
                ),
              ),
            ),
          ),
        );
      }
    }

    return blocks;
  }
}
