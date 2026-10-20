import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter/services.dart';
import '../providers/schedule_provider.dart';
import '../services/api_service.dart';
import '../components/schedule_grid.dart';
import 'dart:math';

class ResultsScreen extends StatefulWidget {
  const ResultsScreen({Key? key}) : super(key: key);

  @override
  State<ResultsScreen> createState() => _ResultsScreenState();
}

class _ResultsScreenState extends State<ResultsScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _nextPage(int total) {
    if (_currentPage < total - 1) {
      _pageController.nextPage(duration: const Duration(milliseconds: 300), curve: Curves.easeInOut);
    }
  }

  void _prevPage() {
    if (_currentPage > 0) {
      _pageController.previousPage(duration: const Duration(milliseconds: 300), curve: Curves.easeInOut);
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ScheduleProvider>();
    final schedules = provider.generatedSchedules;

    return Scaffold(
      backgroundColor: const Color(0xFF050505),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text('${schedules.length} جداول سحرية', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: schedules.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.sentiment_dissatisfied_rounded, size: 80, color: Colors.white30),
                  const SizedBox(height: 16),
                  const Text('لم يتم العثور على جداول مناسبة.\nحاول تقليل الشروط في الإعدادات.', 
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.white54, fontSize: 16, height: 1.5)
                  ),
                ],
              ),
            )
          : Column(
              children: [
                // Navigation Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        onPressed: _currentPage > 0 ? _prevPage : null,
                        icon: Icon(Icons.arrow_forward_ios_rounded, color: _currentPage > 0 ? Colors.white : Colors.white30),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF4A62FF).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFF4A62FF).withOpacity(0.5)),
                        ),
                        child: Text(
                          'الخيار ${_currentPage + 1} من ${schedules.length}',
                          style: const TextStyle(color: Color(0xFF4A62FF), fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                      ),
                      IconButton(
                        onPressed: _currentPage < schedules.length - 1 ? () => _nextPage(schedules.length) : null,
                        icon: Icon(Icons.arrow_back_ios_new_rounded, color: _currentPage < schedules.length - 1 ? Colors.white : Colors.white30),
                      ),
                    ],
                  ),
                ),
                
                Expanded(
                  child: PageView.builder(
                    controller: _pageController,
                    onPageChanged: (index) {
                      setState(() {
                        _currentPage = index;
                      });
                    },
                    itemCount: schedules.length,
                    itemBuilder: (context, index) {
                      final schedule = schedules[index];
                      return SingleChildScrollView(
                        physics: const BouncingScrollPhysics(),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              // Score Card
                              Container(
                                padding: const EdgeInsets.all(20),
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFF2B3A67), Color(0xFF1E2749)],
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                  ),
                                  borderRadius: BorderRadius.circular(20),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFF2B3A67).withOpacity(0.3),
                                      blurRadius: 15,
                                      offset: const Offset(0, 5),
                                    )
                                  ],
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            const Icon(Icons.star_rounded, color: Color(0xFFFFD700), size: 18),
                                            const SizedBox(width: 6),
                                            Text('تقييم الذكاء الاصطناعي: ${schedule.score}%', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                                          ],
                                        ),
                                        const SizedBox(height: 12),
                                        Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                              decoration: BoxDecoration(
                                                color: const Color(0xFF2A9D8F).withOpacity(0.2),
                                                borderRadius: BorderRadius.circular(8),
                                                border: Border.all(color: const Color(0xFF2A9D8F).withOpacity(0.5)),
                                              ),
                                              child: const Row(
                                                children: [
                                                  Icon(Icons.check_circle_rounded, color: Color(0xFF2A9D8F), size: 12),
                                                  SizedBox(width: 4),
                                                  Text('0 تعارضات', style: TextStyle(color: Color(0xFF2A9D8F), fontSize: 11, fontWeight: FontWeight.bold)),
                                                ],
                                              ),
                                            ),
                                          ],
                                        )
                                      ],
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                      decoration: BoxDecoration(
                                        color: Colors.white.withOpacity(0.15),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Column(
                                        children: [
                                          Text('${schedule.totalCredits}', style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                                          const Text('ساعة', style: TextStyle(color: Colors.white70, fontSize: 11)),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 20),
                              
                              // Schedule Grid
                              Container(
                                height: 280,
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF0F0F0F),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                                  boxShadow: [
                                    BoxShadow(color: Colors.black.withOpacity(0.5), blurRadius: 10, spreadRadius: 2)
                                  ]
                                ),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(8),
                                  child: ScheduleGrid(schedule: schedule),
                                ),
                              ),
                              const SizedBox(height: 20),
                              
                              const Text('تفاصيل الشُعب', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 12),
                              
                              // Sections List (shrinkWrap so it takes full height in the scroll view)
                              ListView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount: schedule.sections.length,
                                itemBuilder: (context, i) {
                                  final section = schedule.sections[i];
                                  return Container(
                                    margin: const EdgeInsets.only(bottom: 16),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withOpacity(0.04),
                                      borderRadius: BorderRadius.circular(12),
                                      border: Border.all(color: Colors.white.withOpacity(0.05)),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withOpacity(0.1),
                                          blurRadius: 10,
                                          offset: const Offset(0, 4),
                                        )
                                      ],
                                    ),
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(12),
                                      child: Row(
                                        crossAxisAlignment: CrossAxisAlignment.center,
                                        children: [
                                          Container(
                                            width: 6,
                                            // The row must have some height to stretch this if we wanted, 
                                            // but with crossAxisAlignment.center it might be small. 
                                            // Let's just use a fixed large enough height or let it expand.
                                            // Since Row is not stretching, we give it a fixed height.
                                            height: 100, 
                                            color: Colors.primaries[section.colorIndex % Colors.primaries.length],
                                          ),
                                          Expanded(
                                            child: Padding(
                                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    section.courseName.isNotEmpty ? section.courseName : section.courseCode, 
                                                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16, height: 1.3)
                                                  ),
                                                  const SizedBox(height: 12),
                                                  Row(
                                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                    children: [
                                                      Container(
                                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                                        decoration: BoxDecoration(
                                                          color: Colors.white.withOpacity(0.1),
                                                          borderRadius: BorderRadius.circular(8),
                                                        ),
                                                        child: Text(
                                                          section.courseName.isNotEmpty ? '${section.courseCode} - شعبة ${section.sectionNo}' : 'شعبة ${section.sectionNo}', 
                                                          style: const TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold)
                                                        ),
                                                      ),
                                                      Row(
                                                        children: [
                                                          const Icon(Icons.person_rounded, size: 16, color: Colors.white54),
                                                          const SizedBox(width: 4),
                                                          Text(section.instructor, style: const TextStyle(color: Colors.white70, fontSize: 13)),
                                                        ],
                                                      )
                                                    ],
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                            const SizedBox(height: 16),
                            
                            // Bottom Action Buttons
                            Row(
                              children: [
                                Expanded(
                                  child: ElevatedButton.icon(
                                    onPressed: () async {
                                      final sectionCodes = schedule.sections.map((s) => s.sectionNo).join('، ');
                                      await Clipboard.setData(ClipboardData(text: sectionCodes));
                                      if (context.mounted) {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(
                                            content: const Row(
                                              children: [
                                                Icon(Icons.content_copy_rounded, color: Colors.white),
                                                SizedBox(width: 12),
                                                Text('تم نسخ أرقام الشُعب بنجاح!'),
                                              ],
                                            ),
                                            backgroundColor: const Color(0xFF2A9D8F),
                                            behavior: SnackBarBehavior.floating,
                                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                          ),
                                        );
                                      }
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.white.withOpacity(0.08),
                                      foregroundColor: Colors.white,
                                      padding: const EdgeInsets.symmetric(vertical: 14),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                      elevation: 0,
                                    ),
                                    icon: const Icon(Icons.copy_rounded, size: 18),
                                    label: const Text('نسخ الشُعب', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: ElevatedButton.icon(
                                    onPressed: () async {
                                      try {
                                        final api = ApiService();
                                        final slug = await api.shareSchedule(schedule.sections.map((s) => s.id).toList());
                                        final url = 'http://localhost:3000/api/schedules/$slug/ics'; 
                                        await Clipboard.setData(ClipboardData(text: url));
                                        if (context.mounted) {
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            SnackBar(
                                              content: const Row(
                                                children: [
                                                  Icon(Icons.calendar_month_rounded, color: Colors.white),
                                                  SizedBox(width: 12),
                                                  Text('تم نسخ رابط التقويم .ics'),
                                                ],
                                              ),
                                              backgroundColor: const Color(0xFFF7B801),
                                              behavior: SnackBarBehavior.floating,
                                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                            ),
                                          );
                                        }
                                      } catch (e) {
                                        if (context.mounted) {
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            SnackBar(content: Text('خطأ في استخراج التقويم: $e')),
                                          );
                                        }
                                      }
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.white.withOpacity(0.08),
                                      foregroundColor: Colors.white,
                                      padding: const EdgeInsets.symmetric(vertical: 14),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                      elevation: 0,
                                    ),
                                    icon: const Icon(Icons.calendar_month_rounded, size: 18),
                                    label: const Text('تصدير .ics', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            ElevatedButton(
                              onPressed: () async {
                                try {
                                  final api = ApiService();
                                  final slug = await api.shareSchedule(schedule.sections.map((s) => s.id).toList());
                                  final url = 'http://localhost:5173/s/$slug';
                                  await Clipboard.setData(ClipboardData(text: url));
                                  
                                  if (context.mounted) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: const Row(
                                          children: [
                                            Icon(Icons.check_circle_rounded, color: Colors.white),
                                            SizedBox(width: 12),
                                            Text('تم نسخ الرابط السحري بنجاح! ✨', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                                          ],
                                        ),
                                        backgroundColor: const Color(0xFF4A62FF),
                                        behavior: SnackBarBehavior.floating,
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                      ),
                                    );
                                  }
                                } catch (e) {
                                   ScaffoldMessenger.of(context).showSnackBar(
                                     SnackBar(content: Text('خطأ في المشاركة: $e')),
                                   );
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF4A62FF),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                elevation: 8,
                                shadowColor: const Color(0xFF4A62FF).withOpacity(0.4),
                              ),
                              child: const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.share_rounded, size: 20),
                                  SizedBox(width: 12),
                                  Text('شارك هذا الجدول مع أصدقائك', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                            const SizedBox(height: 20),
                          ],
                        ),
                      ),
                    );
                  },
                  ),
                ),
              ],
            ),
    );
  }
}
