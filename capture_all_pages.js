const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('=== Starting Jadwal Screenshot Capture ===');
  
  // Launch Chrome
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // ----------------------------------------------------
  // SECTION 1: WEB APPLICATION (Desktop 1440x960)
  // ----------------------------------------------------
  console.log('\n--- Capturing Web Application Pages ---');
  const webPage = await browser.newPage();
  await webPage.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });

  // 1. Web Home (Empty)
  console.log('1. Capturing Web Home (clean)...');
  await webPage.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await webPage.evaluate(() => {
    localStorage.removeItem('jadwal_selected_courses');
    sessionStorage.removeItem('adminToken');
  });
  await webPage.reload({ waitUntil: 'networkidle0' });
  await sleep(1500);
  await webPage.screenshot({
    path: path.join(SCREENSHOTS_DIR, '01_web_student_home.png')
  });

  // 2. Web with Courses Selected
  console.log('2. Capturing Web with Courses Selected...');
  await webPage.evaluate(() => {
    const selected = [
      { id: 'course-math101', code: 'MATH101', nameAr: 'التفاضل والتكامل (1)', creditHours: 3 },
      { id: 'course-cs111', code: 'CS111', nameAr: 'برمجة الحاسوب (1) C++', creditHours: 3 },
      { id: 'course-phys101', code: 'PHYS101', nameAr: 'الفيزياء العامة (1)', creditHours: 3 },
      { id: 'course-cs212', code: 'CS212', nameAr: 'تراكيب البيانات والخوارزميات', creditHours: 3 }
    ];
    localStorage.setItem('jadwal_selected_courses', JSON.stringify(selected));
  });
  await webPage.reload({ waitUntil: 'networkidle0' });
  await sleep(1500);
  await webPage.screenshot({
    path: path.join(SCREENSHOTS_DIR, '02_web_course_selection.png')
  });

  // 3. Web Timetable Generated
  console.log('3. Generating timetable and capturing Schedule Grid...');
  await webPage.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const gen = btns.find(b => b.textContent && (b.textContent.includes('توليد') || b.textContent.includes('Generate')));
    if (gen) gen.click();
  });
  await sleep(3000);
  await webPage.screenshot({
    path: path.join(SCREENSHOTS_DIR, '03_web_timetable_generated.png')
  });

  // 4. Shared Schedule View
  console.log('4. Capturing Shared Schedule View...');
  await webPage.goto('http://localhost:5173/s/demo-schedule', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await webPage.screenshot({
    path: path.join(SCREENSHOTS_DIR, '04_web_shared_schedule.png')
  });

  // 5. Admin Login
  console.log('5. Capturing Admin Login...');
  await webPage.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle0' });
  await sleep(1000);
  await webPage.screenshot({
    path: path.join(SCREENSHOTS_DIR, '05_web_admin_login.png')
  });

  // 6. Admin Dashboard Overview
  console.log('6. Capturing Admin Dashboard...');
  await webPage.evaluate(() => {
    sessionStorage.setItem('adminToken', 'jadwal-admin-secret-token');
  });
  await webPage.goto('http://localhost:5173/admin', { waitUntil: 'networkidle0' });
  await sleep(2000);
  await webPage.screenshot({
    path: path.join(SCREENSHOTS_DIR, '06_web_admin_dashboard.png')
  });

  // 7. Admin Universities
  console.log('7. Capturing Admin Universities...');
  await webPage.goto('http://localhost:5173/admin/universities', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await webPage.screenshot({
    path: path.join(SCREENSHOTS_DIR, '07_web_admin_universities.png')
  });

  // 8. Admin Schedules
  console.log('8. Capturing Admin Schedules...');
  await webPage.goto('http://localhost:5173/admin/schedules', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await webPage.screenshot({
    path: path.join(SCREENSHOTS_DIR, '08_web_admin_schedules.png')
  });

  // 9. Admin Settings
  console.log('9. Capturing Admin Settings...');
  await webPage.goto('http://localhost:5173/admin/settings', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await webPage.screenshot({
    path: path.join(SCREENSHOTS_DIR, '09_web_admin_settings.png')
  });

  await webPage.close();

  // ----------------------------------------------------
  // SECTION 2: MOBILE APPLICATION (Viewport 390x844)
  // ----------------------------------------------------
  console.log('\n--- Capturing Flutter Mobile Application Screens ---');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  console.log('10. Loading Mobile Home Screen...');
  await mobilePage.goto('http://localhost:5000', { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForSelector('flutter-view, flt-glass-pane, canvas', { timeout: 30000 });
  await sleep(3500);
  await mobilePage.screenshot({
    path: path.join(SCREENSHOTS_DIR, '10_mobile_home_screen.png')
  });

  // Navigate to Course Picker Screen by tapping university card (x=195, y=720)
  console.log('11. Navigating to Mobile Course Picker Screen...');
  await mobilePage.mouse.click(195, 720);
  await sleep(2500);
  // Select first two courses: Item 1 (x=195, y=200), Item 2 (x=195, y=280)
  await mobilePage.mouse.click(195, 200);
  await sleep(400);
  await mobilePage.mouse.click(195, 280);
  await sleep(600);
  await mobilePage.screenshot({
    path: path.join(SCREENSHOTS_DIR, '11_mobile_course_picker.png')
  });

  // Navigate to Preferences Screen by tapping Next button (x=300, y=790)
  console.log('12. Navigating to Mobile Preferences Screen...');
  await mobilePage.mouse.click(300, 790);
  await sleep(2500);
  await mobilePage.screenshot({
    path: path.join(SCREENSHOTS_DIR, '12_mobile_preferences_screen.png')
  });

  // Navigate to Results Screen by tapping "توليد الجداول السحرية" (x=195, y=790)
  console.log('13. Generating schedules & capturing Mobile Results Screen...');
  await mobilePage.mouse.click(195, 790);
  await sleep(4000);
  await mobilePage.screenshot({
    path: path.join(SCREENSHOTS_DIR, '13_mobile_timetable_results.png')
  });

  await mobilePage.close();
  await browser.close();

  console.log('\n=== All 13 Project Screenshots Successfully Captured! ===');
}

run().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
