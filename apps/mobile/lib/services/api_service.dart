import 'dart:convert';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import '../models/course.dart';
import '../models/schedule.dart';

class ApiService {
  // Automatically switch between localhost (Web) and 10.0.2.2 (Android Emulator)
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:3000/api';
    return 'http://10.0.2.2:3000/api';
  } 

  Future<List<Course>> getCourses() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/courses'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Course.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load courses');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  Future<List<Schedule>> generateSchedules(Map<String, dynamic> requestBody) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/solve'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(requestBody),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = json.decode(response.body);
        final List<dynamic> schedulesData = data['schedules'] ?? [];
        return schedulesData.map((json) => Schedule.fromJson(json)).toList();
      } else {
        throw Exception('Failed to generate schedules');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  Future<String> shareSchedule(List<String> sectionIds) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/schedules/share'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'termId': 'fall2026',
          'sectionIds': sectionIds,
        }),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['slug'];
      } else {
        throw Exception('Failed to share schedule: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }
}
