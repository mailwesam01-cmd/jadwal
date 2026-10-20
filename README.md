# Jadwal - جدول 📅🚀
> **منظومة التنسيق الذكي للجداول الجامعية لطلاب الجامعات الأردنية**  
> *Smart Course-Registration & Timetable Optimization Platform for Jordanian University Students*

[![Node.js](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)

---

## 📖 نظرة عامة على المشروع (Project Overview)
**جدول (Jadwal)** هو حل تقني متكامل لمعضلة تسجيل المواد وإعداد الجداول الفصلية في الجامعات الأردنية. يقوم النظام باستبدال الطرق التقليدية المجهدة (الورق والقلم، مجموعات الواتساب، التنسيق اليدوي) بخوارزميات ذكاء اصطناعي وبحث عكسي (Backtracking Search) لإيجاد كل الجداول الممكنة الخالية من أي تعارض بنسبة 100% مع مراعاة كافة تفضيلات الطالب (تقليل ساعات الفراغ، تفضيل أيام معينة، تجنب الساعات المبكرة أو المتأخرة، وتحديد المدرسين المفضلين).

النظام مبني بهيكلية **Monorepo** يضم:
1. **الواجهة الرئيسية للطلاب (Web Portal):** واجهة ويب سريعة جداً ومبنية بـ React 19 + TypeScript.
2. **تطبيق الهاتف الذكي (Mobile App):** تطبيق Flutter عصري بتصميم جذاب ومريح للعين مع تجربة استخدام سلسة.
3. **محرك الخوارزميات والخادم (NestJS Backend):** خادم REST API قوي يقوم بحساب التباديل والتعارضات وتصدير ملفات التقويم iCal / ICS ومشاركة الروابط.
4. **لوحة تحكم الإدارة (Admin Dashboard):** لوحة تحكم متكاملة لمتابعة إحصائيات الاستخدام، إدارة الجامعات، والفصول الدراسية، والكتالوجات.

---

## 📸 معرض صور وشاشات المشروع (Screenshots Gallery)

### أولاً: تطبيق الويب ومنصة الطلاب (Web Application)

| 01. الصفحة الرئيسية والبحث عن المواد | 02. اختيار المواد وتحديد الساعات |
| :---: | :---: |
| ![Web Student Home](screenshots/01_web_student_home.png) | ![Web Course Selection](screenshots/02_web_course_selection.png) |

| 03. الجدول المقترح المولد بدون تعارضات | 04. صفحة الجدول المشترك ومشاركته مع الزملاء |
| :---: | :---: |
| ![Web Timetable Generated](screenshots/03_web_timetable_generated.png) | ![Web Shared Schedule](screenshots/04_web_shared_schedule.png) |

---

### ثانياً: لوحة تحكم الإدارة (Admin Dashboard)

| 05. بوابة تسجيل دخول المشرف | 06. لوحة الإحصائيات وسجل النشاط اللحظي |
| :---: | :---: |
| ![Admin Login](screenshots/05_web_admin_login.png) | ![Admin Dashboard](screenshots/06_web_admin_dashboard.png) |

| 07. إدارة الجامعات والكتالوجات | 08. متابعة الجداول المشتركة والزيارات |
| :---: | :---: |
| ![Admin Universities](screenshots/07_web_admin_universities.png) | ![Admin Schedules](screenshots/08_web_admin_schedules.png) |

| 09. إعدادات النظام ومعايير الخوارزمية |
| :---: |
| ![Admin Settings](screenshots/09_web_admin_settings.png) |

---

### ثالثاً: تطبيق الموبايل (Flutter Mobile Application)

| 10. شاشة الترحيب واختيار الجامعة | 11. اختيار المواد والحد المعتمد |
| :---: | :---: |
| ![Mobile Home](screenshots/10_mobile_home_screen.png) | ![Mobile Course Picker](screenshots/11_mobile_course_picker.png) |

| 12. تفضيلات الذكاء الاصطناعي والأوقات المحظورة | 13. النتائج الذكية والجداول المبتكرة |
| :---: | :---: |
| ![Mobile Preferences](screenshots/12_mobile_preferences_screen.png) | ![Mobile Timetable Results](screenshots/13_mobile_timetable_results.png) |

---

## 🛠️ البنية التقنية (Technology Stack)

- **Backend:** [NestJS](https://nestjs.com/) (Node.js framework), TypeORM, Better-SQLite3, Multer, XLSX parser.
- **Frontend (Web):** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), Lucide Icons, html2canvas.
- **Mobile:** [Flutter 3](https://flutter.dev/) (Dart), Provider for State Management, Google Fonts Cairo.
- **Architecture:** Monorepo (`apps/api`, `apps/web`, `apps/mobile`).

---

## ⚡ التشغيل السريع (Quick Start)

### الطريقة السريعة بنقرة واحدة (Windows Direct Launch):
1. **لتشغيل الموقع والخادم ولوحة التحكم:**
   - انقر نقراً مزدوجاً على الملف: `RUN_DASHBOARD.bat`
   - الرابط العام للموقع: `http://localhost:5173`
   - رابط لوحة تحكم المشرف: `http://localhost:5173/admin`  
     *(كلمة المرور الافتراضية: `admin123`)*

2. **لتشغيل تطبيق الموبايل:**
   - انقر نقراً مزدوجاً على الملف: `RUN_MOBILE.bat`
   - سيعمل التطبيق على الرابط: `http://localhost:5000`

---

## 💻 التشغيل اليدوي عبر سطر الأوامر (Manual Setup)

```bash
# 1. تثبيت الحزم والمكتبات
npm install

# 2. بناء وتشغيل الخادم الخلفي (API Server)
npm run start:dev --workspace=api

# 3. تشغيل واجهة الويب (Web App)
npm run dev --workspace=web

# 4. تشغيل تطبيق الهاتف (Mobile App via Flutter)
cd apps/mobile
flutter pub get
flutter run -d chrome
```

---

## 🔐 بيانات المشرف (Admin Credentials)
- **رابط الدخول:** `http://localhost:5173/admin/login`
- **اسم المستخدم:** `admin`
- **كلمة المرور:** `admin123`
