import 'package:flutter/material.dart';
import '../models/course.dart';
import '../models/schedule.dart';
import '../services/api_service.dart';
class BlockedWindow {
  final int dayOfWeek;
  final String startsAt;
  final String endsAt;

  BlockedWindow({required this.dayOfWeek, required this.startsAt, required this.endsAt});

  Map<String, dynamic> toJson() => {
    'dayOfWeek': dayOfWeek,
    'startsAt': startsAt,
    'endsAt': endsAt,
  };
}

class ScheduleProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  List<Course> _allCourses = [];
  List<Course> _selectedCourses = [];
  List<Schedule> _generatedSchedules = [];
  bool _isLoading = false;
  String _error = '';

  // Preferences
  int _minCredits = 12;
  int _maxCredits = 18;
  int _gapWeight = 50;
  int _daysWeight = 50;
  String _earlyTime = '08:00';
  String _lateTime = '16:00';
  List<BlockedWindow> blockedWindows = [];

  int get minCredits => _minCredits;
  set minCredits(int value) {
    _minCredits = value;
    notifyListeners();
  }

  int get maxCredits => _maxCredits;
  set maxCredits(int value) {
    _maxCredits = value;
    notifyListeners();
  }

  int get gapWeight => _gapWeight;
  set gapWeight(int value) {
    _gapWeight = value;
    notifyListeners();
  }

  int get daysWeight => _daysWeight;
  set daysWeight(int value) {
    _daysWeight = value;
    notifyListeners();
  }

  String get earlyTime => _earlyTime;
  set earlyTime(String value) {
    _earlyTime = value;
    notifyListeners();
  }

  String get lateTime => _lateTime;
  set lateTime(String value) {
    _lateTime = value;
    notifyListeners();
  }

  List<Course> get allCourses => _allCourses;
  List<Course> get selectedCourses => _selectedCourses;
  List<Schedule> get generatedSchedules => _generatedSchedules;
  bool get isLoading => _isLoading;
  String get error => _error;

  Future<void> fetchCourses() async {
    _isLoading = true;
    _error = '';
    notifyListeners();

    try {
      _allCourses = await _apiService.getCourses();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void toggleCourseSelection(Course course) {
    if (_selectedCourses.any((c) => c.id == course.id)) {
      _selectedCourses.removeWhere((c) => c.id == course.id);
    } else {
      _selectedCourses.add(course);
    }
    notifyListeners();
  }

  void addBlockedWindow(int day, String start, String end) {
    blockedWindows.add(BlockedWindow(dayOfWeek: day, startsAt: start, endsAt: end));
    notifyListeners();
  }

  void removeBlockedWindow(int index) {
    blockedWindows.removeAt(index);
    notifyListeners();
  }

  Future<bool> generateSchedules() async {
    if (_selectedCourses.isEmpty) return false;

    _isLoading = true;
    _error = '';
    notifyListeners();

    try {
      final request = {
        'termId': 'fall2026',
        'courseIds': _selectedCourses.map((c) => c.id).toList(),
        'limit': 10,
        'hard': {
          'minCredits': minCredits,
          'maxCredits': maxCredits,
          'includeFullSections': true,
          'blockedWindows': blockedWindows.map((w) => w.toJson()).toList()
        },
        'soft': {
          'preferredEarliest': earlyTime,
          'preferredLatest': lateTime,
          'preferredInstructors': [],
          'weights': {
            'gap': gapWeight / 100.0,
            'days': daysWeight / 100.0,
            'early': 0.0,
            'late': 0.0,
            'instructor': 0.0,
          }
        }
      };

      _generatedSchedules = await _apiService.generateSchedules(request);
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
