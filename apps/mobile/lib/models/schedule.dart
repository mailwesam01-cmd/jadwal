class Schedule {
  final List<ScheduleSection> sections;
  final int totalCredits;
  final int score;

  Schedule({
    required this.sections,
    required this.totalCredits,
    required this.score,
  });

  factory Schedule.fromJson(Map<String, dynamic> json) {
    int totalCredits = 0;
    List<ScheduleSection> parsedSections = [];
    int colorCounter = 1;
    Map<String, int> courseColors = {};

    if (json['sections'] != null) {
      for (var sec in (json['sections'] as List)) {
        final courseId = sec['courseId'] ?? sec['courseCode'] ?? 'unknown';
        if (!courseColors.containsKey(courseId)) {
          courseColors[courseId] = colorCounter++;
        }
        sec['colorIndex'] = courseColors[courseId];
        
        int credits = ((sec['credits'] ?? 3) as num).toInt();
        totalCredits += credits;
        
        parsedSections.add(ScheduleSection.fromJson(sec));
      }
    }

    return Schedule(
      sections: parsedSections,
      totalCredits: (json['totalCredits'] as num?)?.toInt() ?? totalCredits,
      score: (json['score'] as num?)?.toInt() ?? 0,
    );
  }
}

class ScheduleSection {
  final String id;
  final String courseCode;
  final String courseName;
  final String sectionNo;
  final String instructor;
  final int colorIndex;
  final List<MeetingTime> meetingTimes;

  ScheduleSection({
    required this.id,
    required this.courseCode,
    required this.courseName,
    required this.sectionNo,
    required this.instructor,
    required this.colorIndex,
    required this.meetingTimes,
  });

  factory ScheduleSection.fromJson(Map<String, dynamic> json) {
    return ScheduleSection(
      id: json['id'] ?? '',
      courseCode: json['courseCode'] ?? '',
      courseName: json['courseName'] ?? '',
      sectionNo: json['sectionNo'] ?? '',
      instructor: json['instructor'] ?? 'TBA',
      colorIndex: json['colorIndex'] ?? 1,
      meetingTimes: (json['meetingTimes'] as List)
          .map((mt) => MeetingTime.fromJson(mt))
          .toList(),
    );
  }
}

class MeetingTime {
  final int dayOfWeek;
  final String startsAt;
  final String endsAt;
  final String room;

  MeetingTime({
    required this.dayOfWeek,
    required this.startsAt,
    required this.endsAt,
    required this.room,
  });

  factory MeetingTime.fromJson(Map<String, dynamic> json) {
    return MeetingTime(
      dayOfWeek: json['dayOfWeek'] ?? 0,
      startsAt: json['startsAt'] ?? '',
      endsAt: json['endsAt'] ?? '',
      room: json['room'] ?? 'TBA',
    );
  }
}
