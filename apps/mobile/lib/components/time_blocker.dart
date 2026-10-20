import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/schedule_provider.dart';

class TimeBlocker extends StatefulWidget {
  const TimeBlocker({Key? key}) : super(key: key);

  @override
  State<TimeBlocker> createState() => _TimeBlockerState();
}

class _TimeBlockerState extends State<TimeBlocker> {
  int _selectedDay = 0;
  String _startTime = '08:00';
  String _endTime = '09:30';

  final List<String> days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  
  // Generating simple hours for simplicity
  final List<String> times = List.generate(11, (i) {
    final hour = 8 + i;
    return '${hour.toString().padLeft(2, '0')}:00';
  }) + List.generate(10, (i) {
    final hour = 8 + i;
    return '${hour.toString().padLeft(2, '0')}:30';
  }).toList()..sort();

  void _addBlockedTime() {
    if (_startTime.compareTo(_endTime) >= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('وقت البداية يجب أن يكون قبل وقت النهاية'),
          backgroundColor: Color(0xFFE53935),
        )
      );
      return;
    }
    context.read<ScheduleProvider>().addBlockedWindow(_selectedDay, _startTime, _endTime);
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ScheduleProvider>();
    final blockedWindows = provider.blockedWindows;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              flex: 2,
              child: _buildDropdown(
                'اليوم',
                _selectedDay,
                days.asMap().entries.map((e) => DropdownMenuItem(value: e.key, child: Text(e.value))).toList(),
                (val) { if (val != null) setState(() => _selectedDay = val as int); }
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              flex: 2,
              child: _buildDropdown(
                'من',
                _startTime,
                times.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                (val) { if (val != null) setState(() => _startTime = val as String); }
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              flex: 2,
              child: _buildDropdown(
                'إلى',
                _endTime,
                times.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                (val) { if (val != null) setState(() => _endTime = val as String); }
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: _addBlockedTime,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF4A62FF).withOpacity(0.2),
              foregroundColor: const Color(0xFF4A62FF),
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            icon: const Icon(Icons.add_rounded, size: 18),
            label: const Text('إضافة وقت محظور', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ),
        
        if (blockedWindows.isNotEmpty) ...[
          const SizedBox(height: 16),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: blockedWindows.length,
            itemBuilder: (context, index) {
              final bw = blockedWindows[index];
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFFE53935).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE53935).withOpacity(0.3)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${days[bw.dayOfWeek]} : ${bw.startsAt} - ${bw.endsAt}',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    InkWell(
                      onTap: () => provider.removeBlockedWindow(index),
                      child: const Icon(Icons.close_rounded, color: Color(0xFFE53935), size: 20),
                    )
                  ],
                ),
              );
            },
          ),
        ]
      ],
    );
  }

  Widget _buildDropdown(String label, dynamic value, List<DropdownMenuItem<dynamic>> items, Function(dynamic) onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white54, fontSize: 12)),
        const SizedBox(height: 4),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Colors.white.withOpacity(0.1)),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<dynamic>(
              value: value,
              isExpanded: true,
              dropdownColor: const Color(0xFF1A1A1A),
              icon: const Icon(Icons.keyboard_arrow_down_rounded, color: Colors.white54, size: 16),
              style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
              items: items,
              onChanged: onChanged,
            ),
          ),
        ),
      ],
    );
  }
}
