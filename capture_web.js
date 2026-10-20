const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureWebScreenshots() {
  console.log('Launching Chrome for Web screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1440,960'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });

  // 1. Web Home (Student Schedule Generator)
  console.log('1. Capturing Web Home...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '01_web_student_home.png'),
    fullPage: false
  });

  // 2. Select courses and capture Course Selection
  console.log('2. Selecting courses & capturing Course Selection...');
  // Find course buttons/items to click
  await page.evaluate(() => {
    // Look for course selection buttons or cards
    const buttons = Array.from(document.querySelectorAll('button, div, span'));
    const math = buttons.find(el => el.textContent && el.textContent.includes('التفاضل والتكامل'));
    if (math) math.click();
    const cs = buttons.find(el => el.textContent && el.textContent.includes('برمجة الحاسوب'));
    if (cs) cs.click();
    const phys = buttons.find(el => el.textContent && el.textContent.includes('الفيزياء العامة'));
    if (phys) phys.click();
    const ds = buttons.find(el => el.textContent && el.textContent.includes('تراكيب البيانات'));
    if (ds) ds.click();
  });
  await sleep(1000);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '02_web_course_selection.png'),
    fullPage: false
  });

  // 3. Generate Schedules & capture Timetable Grid
  console.log('3. Generating timetable & capturing Schedule Grid...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const generateBtn = buttons.find(b => b.textContent && (b.textContent.includes('توليد') || b.textContent.includes('Generate')));
    if (generateBtn) generateBtn.click();
  });
  await sleep(2500);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '03_web_timetable_generated.png'),
    fullPage: false
  });

  // 4. Shared Schedule View
  console.log('4. Capturing Shared Schedule View...');
  await page.goto('http://localhost:5173/s/demo-schedule', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '04_web_shared_schedule.png'),
    fullPage: false
  });

  // 5. Admin Login
  console.log('5. Capturing Admin Login...');
  await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle0' });
  await sleep(1000);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '05_web_admin_login.png'),
    fullPage: false
  });

  // 6. Admin Dashboard Overview
  console.log('6. Capturing Admin Dashboard...');
  await page.evaluate(() => {
    sessionStorage.setItem('adminToken', 'jadwal-admin-secret-token');
  });
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '06_web_admin_dashboard.png'),
    fullPage: false
  });

  // 7. Admin Universities
  console.log('7. Capturing Admin Universities...');
  await page.goto('http://localhost:5173/admin/universities', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '07_web_admin_universities.png'),
    fullPage: false
  });

  // 8. Admin Schedules
  console.log('8. Capturing Admin Schedules...');
  await page.goto('http://localhost:5173/admin/schedules', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '08_web_admin_schedules.png'),
    fullPage: false
  });

  // 9. Admin Settings
  console.log('9. Capturing Admin Settings...');
  await page.goto('http://localhost:5173/admin/settings', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '09_web_admin_settings.png'),
    fullPage: false
  });

  await browser.close();
  console.log('All Web screenshots captured successfully!');
}

captureWebScreenshots().catch(err => {
  console.error('Error during web screenshots:', err);
  process.exit(1);
});
