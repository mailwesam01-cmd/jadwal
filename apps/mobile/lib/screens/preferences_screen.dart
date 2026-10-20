import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/schedule_provider.dart';
import 'results_screen.dart';
import '../components/time_blocker.dart';
import 'dart:ui';

class PreferencesScreen extends StatelessWidget {
  const PreferencesScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ScheduleProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFF050505),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('التفضيلات الذكية', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(24),
              children: [
                _buildSectionHeader(Icons.timer_rounded, 'الساعات المعتمدة'),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: _buildInteractiveNumberInput(
                        'الحد الأدنى', 
                        provider.minCredits, 
                        () => provider.minCredits = (provider.minCredits > 3) ? provider.minCredits - 1 : 3,
                        () => provider.minCredits = (provider.minCredits < provider.maxCredits) ? provider.minCredits + 1 : provider.minCredits,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildInteractiveNumberInput(
                        'الحد الأعلى', 
                        provider.maxCredits, 
                        () => provider.maxCredits = (provider.maxCredits > provider.minCredits) ? provider.maxCredits - 1 : provider.maxCredits,
                        () => provider.maxCredits = (provider.maxCredits < 21) ? provider.maxCredits + 1 : 21,
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 40),
                _buildSectionHeader(Icons.schedule_rounded, 'أوقات الدوام المفضلة'),
                const SizedBox(height: 16),
                
                Row(
                  children: [
                    Expanded(
                      child: _buildTimeDropdown(
                        'وقت البداية',
                        provider.earlyTime,
                        ['08:00', '09:00', '10:00', '11:00', '12:00'],
                        (val) {
                          if (val != null) provider.earlyTime = val;
                        }
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildTimeDropdown(
                        'وقت النهاية',
                        provider.lateTime,
                        ['13:00', '14:00', '15:00', '16:00', '17:00'],
                        (val) {
                          if (val != null) provider.lateTime = val;
                        }
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 40),
                _buildSectionHeader(Icons.block_rounded, 'الأوقات المحظورة'),
                const SizedBox(height: 16),
                const TimeBlocker(),
                
                const SizedBox(height: 40),
                _buildSectionHeader(Icons.tune_rounded, 'أوزان الخوارزمية (الذكاء الاصطناعي)'),
                const SizedBox(height: 24),
                
                _buildPremiumSlider(
                  'تقليص أيام الفراغ (Off-Days)',
                  provider.daysWeight.toDouble(),
                  (val) => provider.daysWeight = val.toInt(),
                  Icons.weekend_rounded,
                ),
                
                const SizedBox(height: 32),
                
                _buildPremiumSlider(
                  'ضغط المحاضرات (أقل فراغات)',
                  provider.gapWeight.toDouble(),
                  (val) => provider.gapWeight = val.toInt(),
                  Icons.compress_rounded,
                ),
                
                const SizedBox(height: 32),
              ],
            ),
          ),
          
          ClipRRect(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: const Color(0xFF0A0A0A).withOpacity(0.8),
                  border: Border(top: BorderSide(color: Colors.white.withOpacity(0.05))),
                ),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: provider.isLoading
                        ? null
                        : () async {
                            final success = await context.read<ScheduleProvider>().generateSchedules();
                            if (success && context.mounted) {
                              Navigator.push(
                                context,
                                PageRouteBuilder(
                                  pageBuilder: (context, anim, secAnim) => const ResultsScreen(),
                                  transitionsBuilder: (context, anim, secAnim, child) {
                                    return FadeTransition(opacity: anim, child: child);
                                  },
                                ),
                              );
                            } else if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('حدث خطأ: ${provider.error}', style: const TextStyle(color: Colors.white)),
                                  backgroundColor: const Color(0xFFE53935),
                                  behavior: SnackBarBehavior.floating,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                ),
                              );
                            }
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF8B4AFF),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 18),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      elevation: 10,
                      shadowColor: const Color(0xFF8B4AFF).withOpacity(0.5),
                    ),
                    child: provider.isLoading 
                      ? const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 3))
                      : const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.auto_awesome_rounded),
                            SizedBox(width: 12),
                            Text('توليد الجداول السحرية', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          ],
                        ),
                  ),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildSectionHeader(IconData icon, String title) {
    return Row(
      children: [
        Icon(icon, color: const Color(0xFF4A62FF), size: 24),
        const SizedBox(width: 12),
        Text(
          title,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
      ],
    );
  }

  Widget _buildInteractiveNumberInput(String label, int value, VoidCallback onDecrement, VoidCallback onIncrement) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.03),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        children: [
          Text(label, style: const TextStyle(color: Colors.white54, fontSize: 13)),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildCircularButton(Icons.remove_rounded, onDecrement),
              Text(
                value.toString(),
                style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
              ),
              _buildCircularButton(Icons.add_rounded, onIncrement),
            ],
          ),
        ],
      ),
    );
  }
  
  Widget _buildTimeDropdown(String label, String currentValue, List<String> options, Function(String?) onChanged) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.03),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: Colors.white54, fontSize: 13)),
          const SizedBox(height: 8),
          DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: currentValue,
              isExpanded: true,
              dropdownColor: const Color(0xFF1A1A1A),
              icon: const Icon(Icons.keyboard_arrow_down_rounded, color: Colors.white54),
              style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
              items: options.map((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
              onChanged: onChanged,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCircularButton(IconData icon, VoidCallback onPressed) {
    return Material(
      color: Colors.white.withOpacity(0.1),
      shape: const CircleBorder(),
      child: InkWell(
        onTap: onPressed,
        customBorder: const CircleBorder(),
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Icon(icon, color: Colors.white, size: 20),
        ),
      ),
    );
  }

  Widget _buildPremiumSlider(String label, double value, Function(double) onChanged, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.03),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(icon, color: Colors.white54, size: 20),
                  const SizedBox(width: 8),
                  Text(label, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF4A62FF).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text('${value.toInt()}%', style: const TextStyle(color: Color(0xFF4A62FF), fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SliderTheme(
            data: SliderThemeData(
              activeTrackColor: const Color(0xFF4A62FF),
              inactiveTrackColor: Colors.white.withOpacity(0.1),
              thumbColor: Colors.white,
              trackHeight: 4,
              overlayColor: const Color(0xFF4A62FF).withOpacity(0.2),
            ),
            child: Slider(
              value: value,
              min: 0,
              max: 100,
              onChanged: onChanged,
            ),
          ),
        ],
      ),
    );
  }
}
