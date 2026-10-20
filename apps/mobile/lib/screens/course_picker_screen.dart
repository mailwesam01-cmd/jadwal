import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:ui';
import '../providers/schedule_provider.dart';
import 'preferences_screen.dart';

class CoursePickerScreen extends StatefulWidget {
  const CoursePickerScreen({Key? key}) : super(key: key);

  @override
  State<CoursePickerScreen> createState() => _CoursePickerScreenState();
}

class _CoursePickerScreenState extends State<CoursePickerScreen> with SingleTickerProviderStateMixin {
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ScheduleProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFF050505),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('اختيار المواد', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: provider.isLoading && provider.allCourses.isEmpty
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF4A62FF)))
          : Column(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
                  child: TextField(
                    onChanged: (val) => setState(() => _searchQuery = val),
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'ابحث عن مادة (مثال: تفاضل)...',
                      hintStyle: const TextStyle(color: Colors.white30),
                      prefixIcon: const Icon(Icons.search_rounded, color: Colors.white54),
                      filled: true,
                      fillColor: Colors.white.withOpacity(0.05),
                      contentPadding: const EdgeInsets.symmetric(vertical: 16),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide.none,
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: Color(0xFF4A62FF), width: 1.5),
                      ),
                    ),
                  ),
                ),
                
                const SizedBox(height: 8),
                
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                    itemCount: provider.allCourses.length,
                    itemBuilder: (context, index) {
                      final course = provider.allCourses[index];
                      if (_searchQuery.isNotEmpty && 
                          !course.name.toLowerCase().contains(_searchQuery.toLowerCase()) && 
                          !course.code.toLowerCase().contains(_searchQuery.toLowerCase())) {
                        return const SizedBox.shrink();
                      }
                      
                      final isSelected = provider.selectedCourses.any((c) => c.id == course.id);

                      return AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeOutCubic,
                        margin: const EdgeInsets.only(bottom: 12),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFF4A62FF).withOpacity(0.15) : Colors.white.withOpacity(0.03),
                          border: Border.all(
                            color: isSelected ? const Color(0xFF4A62FF).withOpacity(0.5) : Colors.white.withOpacity(0.05),
                          ),
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: isSelected ? [
                            BoxShadow(color: const Color(0xFF4A62FF).withOpacity(0.1), blurRadius: 10, offset: const Offset(0, 4))
                          ] : [],
                        ),
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            borderRadius: BorderRadius.circular(16),
                            onTap: () => provider.toggleCourseSelection(course),
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Row(
                                children: [
                                  AnimatedContainer(
                                    duration: const Duration(milliseconds: 300),
                                    width: 44,
                                    height: 44,
                                    decoration: BoxDecoration(
                                      color: isSelected ? const Color(0xFF4A62FF) : Colors.white.withOpacity(0.05),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Icon(
                                      isSelected ? Icons.check_rounded : Icons.menu_book_rounded,
                                      color: isSelected ? Colors.white : Colors.white54,
                                      size: 22,
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          course.name,
                                          style: TextStyle(
                                            color: isSelected ? Colors.white : Colors.white70,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 16,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                              decoration: BoxDecoration(
                                                color: Colors.white.withOpacity(0.1),
                                                borderRadius: BorderRadius.circular(6),
                                              ),
                                              child: Text(
                                                course.code,
                                                style: const TextStyle(color: Colors.white54, fontSize: 11, fontFamily: 'monospace'),
                                              ),
                                            ),
                                            const SizedBox(width: 8),
                                            Text('${course.credits} ساعات', style: const TextStyle(color: Colors.white30, fontSize: 12)),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                
                // Bottom Bar
                ClipRRect(
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                    child: Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0A0A0A).withOpacity(0.8),
                        border: Border(top: BorderSide(color: Colors.white.withOpacity(0.05))),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('المواد المختارة', style: TextStyle(color: Colors.white54, fontSize: 12)),
                              Text(
                                '${provider.selectedCourses.length} مادة',
                                style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                          AnimatedContainer(
                            duration: const Duration(milliseconds: 300),
                            child: ElevatedButton(
                              onPressed: provider.selectedCourses.isEmpty
                                  ? null
                                  : () {
                                      Navigator.push(
                                        context,
                                        PageRouteBuilder(
                                          pageBuilder: (context, anim, secAnim) => const PreferencesScreen(),
                                          transitionsBuilder: (context, anim, secAnim, child) {
                                            return SlideTransition(
                                              position: Tween<Offset>(begin: const Offset(1, 0), end: Offset.zero).animate(anim),
                                              child: child,
                                            );
                                          },
                                        ),
                                      );
                                    },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF4A62FF),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                disabledBackgroundColor: Colors.white.withOpacity(0.05),
                                disabledForegroundColor: Colors.white30,
                                elevation: provider.selectedCourses.isEmpty ? 0 : 8,
                                shadowColor: const Color(0xFF4A62FF).withOpacity(0.5),
                              ),
                              child: const Row(
                                children: [
                                  Text('التالي', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                                  SizedBox(width: 8),
                                  Icon(Icons.arrow_forward_rounded, size: 20),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                )
              ],
            ),
    );
  }
}
