# Project A — **Jadwal** (جدول)

> **A course-registration schedule optimiser for Jordanian university students.**
> Suggested repo: `github.com/<you>/jadwal`
> Tagline: *"Tell it what you need to take. It finds every schedule that works."*

**Stack:** Node.js (NestJS) + React + Flutter + PostgreSQL + Redis + Docker
**Why this one:** it is the only project on this list that can get you **real users**, and
"1,200 students used it during registration week" is worth more in an interview than any
certificate.

---

## 1. The idea

Every semester, a Jordanian student opens the university registration portal and manually tries to
assemble a timetable: pick a section of each required course, check nothing clashes, check the
prerequisites, check the section isn't full, and hope the days don't leave you on campus five days
a week for one lecture each.

Jadwal flips it. The student enters:

- the courses they must take this semester,
- their preferences (no 8 a.m. classes, keep Thursday free, minimise gaps between lectures,
  prefer a specific instructor, maximum 3 days on campus),

and Jadwal **generates every conflict-free timetable**, scores them against the preferences, and
shows the top options ranked — with a one-tap export to Google Calendar and a shareable link.

It is a real constraint-satisfaction problem, and that is exactly why it is a good portfolio piece:
it has an actual algorithm at its centre, not a CRUD form.

---

## 2. The problem it solves

**The pain is universal and severe.** Registration in Jordanian universities is a timed scramble.
Students get a narrow registration window, the portal is slow, sections fill in minutes, and the
UI shows one course at a time with no global view. The standard coping strategies are:

- drawing the timetable on paper or in Excel, one attempt at a time,
- asking older students on WhatsApp groups which sections "work together",
- registering whatever is left and living with a broken schedule for four months.

The consequences are real: students take fewer credits than they could, graduate late, waste hours
in gaps between lectures, or end up commuting to campus daily from another governorate for a
single class.

**Why this is a gap and not a crowded space:** international tools (Coursicle, Rate My Schedule)
are built for US universities and rely on published, machine-readable course catalogues. Jordanian
universities do not publish structured catalogue APIs, the data is Arabic and often only inside a
portal, and no one has built a general tool for this market. The few attempts are single-university
Facebook-group scripts that die when the maintainer graduates.

**Why it makes you hireable:** it proves three things at once — you can model a real optimisation
problem, you can build a full product front to back, and **you can ship something people actually
use.** Very few junior candidates in Amman can point to users.

---

## 3. How it works

```
   ┌──────────────────────────────────────────────────────────────────────┐
   │  CATALOGUE INGESTION                                                 │
   │                                                                      │
   │  A) Manual import  — admin pastes/uploads the semester course list   │
   │                      (CSV / Excel) → normalised into the DB          │
   │  B) Student import — a student pastes their portal's course table;   │
   │                      a parser turns it into structured sections      │
   │  C) Crowd-verify   — students flag wrong times; edits are reviewed   │
   └────────────────────────────┬─────────────────────────────────────────┘
                                ▼
   ┌──────────────────────────────────────────────────────────────────────┐
   │  DOMAIN MODEL                                                        │
   │  Course ── has many ──► Section ── has many ──► MeetingTime          │
   │                          (instructor, capacity)   (day, start, end,  │
   │                                                    room)             │
   └────────────────────────────┬─────────────────────────────────────────┘
                                ▼
   ┌──────────────────────────────────────────────────────────────────────┐
   │  SCHEDULE SOLVER  (the heart)                                        │
   │                                                                      │
   │  1. Build the conflict graph: section A conflicts with section B if  │
   │     any of their MeetingTimes overlap on the same day.               │
   │  2. Backtracking search over courses (most-constrained course first),│
   │     pruning any section that conflicts with the partial solution.    │
   │  3. Apply hard constraints  → discard (blocked times, closed section)│
   │  4. Apply soft constraints  → score 0–100 (gaps, days, start time,   │
   │                                instructor preference)                │
   │  5. Keep the top N by score using a bounded max-heap.                │
   │                                                                      │
   │  Complexity: worst case ∏|sections|, but pruning + ordering makes    │
   │  a typical 6-course / 5-sections-each case solve in < 50 ms.         │
   └────────────────────────────┬─────────────────────────────────────────┘
                                ▼
   ┌──────────────────────────────────────────────────────────────────────┐
   │  DELIVERY                                                            │
   │  React web app  ·  Flutter mobile app  ·  .ics export  ·  share link │
   └──────────────────────────────────────────────────────────────────────┘
```

### The scoring function (make this configurable and document it)

```
score = 100
      − (totalGapMinutes / 30) × w_gap
      − (daysOnCampus − minPossibleDays) × w_days
      − (numberOfLecturesBefore(preferredEarliest)) × w_early
      − (numberOfLecturesAfter(preferredLatest)) × w_late
      + (sectionsWithPreferredInstructor) × w_instructor
```

Expose the weights in the UI as four sliders. Users understand *why* a schedule ranked first, and
you get to say "the ranking is a weighted objective function the user controls" in an interview.

### Hard constraints (never violated)

- No two selected sections may overlap in time.
- Blocked time windows (student's job, prayer time, a fixed commitment) are respected.
- Sections marked closed/full are excluded unless "include full sections" is on.
- Prerequisite chain is respected if prerequisite data is available.

---

## 4. Target audience

**Primary:** undergraduate students at Jordanian universities — Tafila Technical University first
(you have direct access to the catalogue and to testers), then Jordan University of Science and
Technology, Mutah, Yarmouk, JU, and the private universities. Start with **one department at one
university** and expand.

**Secondary:** academic advisors and student unions, who currently answer the same scheduling
questions hundreds of times a semester.

**Tertiary:** the university itself — a working demo is a plausible conversation with a
registration/IT department, and that conversation is a job lead.

---

## 5. Skills used

| Skill | Where it shows up | Signal |
|---|---|---|
| **Node.js / NestJS** | REST API, solver service, auth, jobs | Your newly added keyword, used properly |
| **React** | The main web app — the schedule grid, sliders, comparison view | Highest-demand missing skill, now demonstrated |
| **Flutter** | Mobile app sharing the same API | Mobile keyword |
| **Angular** *(optional)* | Build the admin/catalogue console in Angular instead of React | Lets you honestly claim **both** frameworks with one project |
| **PostgreSQL** | Catalogue schema, indexing, query design | Data modelling |
| **Redis** | Caching solved schedules + rate limiting during registration week | Performance thinking |
| **Algorithms** | Conflict graph, backtracking with pruning, bounded top-N heap, scoring | **The differentiator.** Real CS in a real product. |
| **Docker** | `docker compose up` runs the whole thing | Delivery |
| **Testing** | Solver unit tests with known-answer fixtures; API integration tests | Correctness on an algorithm is easy to prove and impressive |
| **UX under pressure** | Registration week = slow network, panic, phone-first | Product sense |

---

## 6. Design & visual identity

**Concept:** *a calm timetable.* The user arrives stressed, during a two-hour registration window,
usually on a phone. The design job is to reduce panic: large touch targets, obvious primary action,
no decoration that competes with the schedule grid.

### Colour palette

| Role | Hex | Use |
|---|---|---|
| Primary | `#3D348B` | Deep indigo. App bar, primary buttons, brand. |
| Primary light | `#7678ED` | Hover, selected schedule card border. |
| Accent | `#F7B801` | Amber. The "Generate schedules" CTA — the one thing you want tapped. |
| Highlight | `#F18701` | Deeper amber, pressed state. |
| Conflict | `#F35B04` | Orange-red. Overlapping blocks, warnings. |
| Success | `#2A9D8F` | Valid schedule, exported. |
| Surface | `#FFFFFF` | Cards, grid background. |
| Canvas | `#F5F5FA` | Page background, faint indigo tint. |
| Ink | `#1A1A2E` | Text. |
| Muted | `#6E6E85` | Secondary text, grid hour labels. |

**Course-block colours** — a separate 8-colour categorical set so blocks are distinguishable at a
glance and remain distinguishable for colour-blind users. Each block also carries the course code
as text, so colour is never the only signal:

`#3D348B` `#2A9D8F` `#E36414` `#5FA8D3` `#9A348E` `#606C38` `#BC4749` `#4A5859`

Rationale: indigo reads academic and calm without being institutional-boring. Amber is used **once
per screen**, for the primary action, so the eye always knows where to go under time pressure.

### Typography

- **Latin:** `Inter`. **Arabic:** `IBM Plex Sans Arabic`. Both open-licensed, both readable at small
  sizes inside grid blocks.
- Grid hour labels in `Inter` tabular figures so the column aligns.
- Minimum 14 sp inside blocks, 16 sp for body, 48 dp tap targets.

### Key screens

1. **Course picker** — search by code or Arabic name, chips for selected courses, live count.
2. **Preferences** — four sliders (gaps / days on campus / earliest start / latest end), a
   "block time" grid you drag over, an instructor preference list.
3. **Results** — horizontally swipeable schedule cards, each showing the full week grid in
   miniature with its score badge. Tap to expand.
4. **Schedule detail** — full week grid, section codes and instructors listed underneath, buttons:
   *Export .ics*, *Share link*, *Copy section numbers* (so the student can paste them straight into
   the registration portal — this is the feature that makes it genuinely useful).
5. **Compare** — two schedules side by side, differences highlighted.

### RTL and Arabic

The app must be fully Arabic-first with correct RTL, including the timetable grid — in RTL the week
should read right to left. Get this right and it is a talking point; get it wrong and it is the
first thing a Jordanian reviewer notices.

---

## 7. Repository structure

```
jadwal/
├── README.md                        ← GIF of picking 6 courses → ranked schedules
├── LICENSE                          ← MIT
├── docker-compose.yml               ← api + postgres + redis + web
├── docs/
│   ├── solver.md                    ← the algorithm, with complexity analysis
│   ├── data-model.md
│   └── importing-a-university.md    ← how to onboard a new university
├── apps/
│   ├── api/                         ← NestJS
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── catalogue/{catalogue.module.ts,course.entity.ts,section.entity.ts}
│   │   │   ├── import/{csv-importer.service.ts,portal-paste-parser.service.ts}
│   │   │   ├── solver/
│   │   │   │   ├── solver.service.ts
│   │   │   │   ├── conflict-graph.ts
│   │   │   │   ├── backtracking-search.ts
│   │   │   │   ├── scoring.ts
│   │   │   │   └── types.ts
│   │   │   ├── schedules/{share.controller.ts,ics.service.ts}
│   │   │   └── common/{cache,rate-limit,validation}/
│   │   └── test/
│   │       ├── solver.spec.ts       ← known-answer fixtures
│   │       └── api.e2e-spec.ts
│   ├── web/                         ← React + Vite + TypeScript
│   │   └── src/
│   │       ├── features/{picker,preferences,results,compare}/
│   │       ├── components/ScheduleGrid.tsx
│   │       └── lib/api.ts
│   ├── admin/                       ← Angular (catalogue management)
│   └── mobile/                      ← Flutter
├── packages/
│   └── shared-types/                ← TS types shared by api + web + admin
└── .github/workflows/ci.yml
```

---

## 8. Database schema (PostgreSQL)

```sql
CREATE TABLE universities (
  id            uuid PRIMARY KEY,
  code          text NOT NULL UNIQUE,        -- 'ttu'
  name_en       text NOT NULL,
  name_ar       text NOT NULL,
  timezone      text NOT NULL DEFAULT 'Asia/Amman'
);

CREATE TABLE terms (
  id            uuid PRIMARY KEY,
  university_id uuid NOT NULL REFERENCES universities(id),
  code          text NOT NULL,               -- '2026-fall'
  name_ar       text NOT NULL,
  starts_on     date, ends_on date,
  is_active     boolean NOT NULL DEFAULT false,
  UNIQUE (university_id, code)
);

CREATE TABLE courses (
  id            uuid PRIMARY KEY,
  term_id       uuid NOT NULL REFERENCES terms(id),
  code          text NOT NULL,               -- 'CS314'
  name_en       text, name_ar text NOT NULL,
  credit_hours  int  NOT NULL,
  department    text,
  UNIQUE (term_id, code)
);

CREATE TABLE sections (
  id            uuid PRIMARY KEY,
  course_id     uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  section_no    text NOT NULL,               -- '1', '2', 'A'
  instructor    text,
  capacity      int, enrolled int,
  is_open       boolean NOT NULL DEFAULT true,
  verified_at   timestamptz,                 -- crowd-verification
  UNIQUE (course_id, section_no)
);

CREATE TABLE meeting_times (
  id            uuid PRIMARY KEY,
  section_id    uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  day_of_week   smallint NOT NULL,           -- 0=Sunday (Jordan week starts Sunday)
  starts_at     time NOT NULL,
  ends_at       time NOT NULL,
  room          text,
  CHECK (ends_at > starts_at)
);
CREATE INDEX ix_meeting_section ON meeting_times(section_id);

CREATE TABLE prerequisites (
  course_id     uuid NOT NULL REFERENCES courses(id),
  requires_code text NOT NULL,
  PRIMARY KEY (course_id, requires_code)
);

CREATE TABLE shared_schedules (                -- for the share link
  slug          text PRIMARY KEY,              -- short, url-safe
  term_id       uuid NOT NULL REFERENCES terms(id),
  section_ids   uuid[] NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  views         int NOT NULL DEFAULT 0
);

CREATE TABLE correction_reports (              -- crowd-verification queue
  id            uuid PRIMARY KEY,
  section_id    uuid NOT NULL REFERENCES sections(id),
  field         text NOT NULL,
  suggested     text NOT NULL,
  status        text NOT NULL DEFAULT 'pending',
  created_at    timestamptz NOT NULL DEFAULT now()
);
```

**Note on privacy:** Jadwal needs **no student accounts and no personal data** for the core flow —
courses in, schedules out. Keep it that way as long as you can; "I designed it so it never stores
personal data" is a good answer to a security question.

---

## 9. API contract

```http
GET  /api/terms/:termId/courses?q=CS3
→ [ { id, code, nameAr, creditHours, sections: [ { id, sectionNo, instructor, isOpen,
                                                   meetingTimes: [ {dayOfWeek, startsAt, endsAt, room} ] } ] } ]

POST /api/solve
{
  "termId": "…",
  "courseIds": ["…","…","…"],
  "hard": {
    "blockedWindows": [ { "dayOfWeek": 4, "startsAt": "08:00", "endsAt": "23:59" } ],
    "includeFullSections": false
  },
  "soft": {
    "preferredEarliest": "09:30", "preferredLatest": "15:30",
    "weights": { "gap": 1.0, "days": 2.0, "early": 1.5, "late": 0.5, "instructor": 3.0 },
    "preferredInstructors": ["د. أحمد"]
  },
  "limit": 20
}
→ 200
{
  "totalFound": 3184,
  "returned": 20,
  "elapsedMs": 41,
  "schedules": [
    { "score": 92.5, "daysOnCampus": 3, "totalGapMinutes": 60,
      "sections": [ { "courseCode": "CS314", "sectionNo": "2", "instructor": "…" } ] }
  ]
}

POST /api/schedules/share   → { slug }
GET  /api/schedules/:slug
GET  /api/schedules/:slug/ics
POST /api/corrections
```

---

## 10. Build plan

### Phase 1 — Model + solver, no UI (week 1)
- [ ] NestJS project, Postgres, entities, migrations.
- [ ] Hand-enter **one real semester of one department** as seed data (yours).
- [ ] `ConflictGraph` + `BacktrackingSearch` + `Scoring` as pure functions.
- [ ] Jest tests with known-answer fixtures: 3 courses × 3 sections where exactly 4 valid
      combinations exist — assert exactly those 4.
- **Done when:** `POST /api/solve` returns ranked schedules from curl.

### Phase 2 — Web app (week 2–3)
- [ ] React + Vite + TypeScript, shared types package.
- [ ] Course picker with Arabic search, preferences panel, results carousel.
- [ ] `ScheduleGrid` component — the piece you will screenshot everywhere. Make it excellent.
- [ ] Full ar/en + RTL.
- **Done when:** you can build your own next semester with it, faster than by hand.

### Phase 3 — Make it shareable (week 3)
- [ ] Share links, `.ics` export, "copy section numbers".
- [ ] Deploy publicly (Vercel/Netlify for the web app, Railway/Fly/Azure for the API).
- **Done when:** you send the link to five classmates and they use it without asking you how.

### Phase 4 — Catalogue at scale (week 4)
- [ ] CSV/Excel importer + the "paste your portal table" parser.
- [ ] Angular admin console: manage terms, courses, sections, review correction reports.
- [ ] Redis cache keyed on the request hash; rate limiting for registration week.
- **Done when:** a friend at another university can be onboarded in under an hour.

### Phase 5 — Mobile (week 5)
- [ ] Flutter app on the same API, offline cache of the catalogue.
- [ ] Signed APK on GitHub Releases.

### Phase 6 — Launch (registration week)
- [ ] Post it in university Facebook/WhatsApp groups **before** registration opens.
- [ ] Add privacy-respecting analytics (Plausible/Umami — no personal data).
- [ ] Put the usage numbers in the README and on LinkedIn.
- **Done when:** you can write "used by N students across M universities" — that sentence is the
  entire point of this project.

---

## 11. How to talk about it in an interview

> *"Course registration here is a scramble, so I modelled it as a constraint-satisfaction problem.
> Sections become nodes in a conflict graph, I search combinations with backtracking and prune on
> the first overlap, and rank the survivors with a weighted objective function the student
> controls. A typical six-course search finds a few thousand valid schedules in about 40
> milliseconds. I deployed it before registration week and N students used it."*

The number at the end is what they will remember.
