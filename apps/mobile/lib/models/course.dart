class Course {
  final String id;
  final String code;
  final String name;
  final int credits;

  Course({
    required this.id,
    required this.code,
    required this.name,
    required this.credits,
  });

  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      id: json['id'],
      code: json['code'],
      name: json['nameAr'] ?? json['nameEn'] ?? 'Unknown',
      credits: json['creditHours'] ?? 3,
    );
  }
}
