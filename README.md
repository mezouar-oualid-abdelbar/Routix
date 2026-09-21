# Routix

A React Native (Expo) routine & activity tracker. Define activities with types and
schedules, execute them day by day with per-day progress history, and review
completion statistics over weeks, months, and years.

## Features

- **Activity definitions** — title, description, priority, type, schedule, reminder time
- **Activity types** — `normal`, `timed` (duration), `follow_up` (ordered steps),
  `multi_activities` (child tasks, each optionally timed)
- **Schedules** — `normal` (daily), `weekly` (selected weekdays), `interval` (every N days,
  rolling anchor: due N+ days after the last completion)
- **Per-day execution log** — start / progress / complete flows per activity type with
  persistent progress (timers, completed steps/tasks survive screen and app restarts)
- **Today view** — what's scheduled today + today's progress per activity
- **Status view** — Week/Month/Year statistics, day strip, and per-day breakdown
- **Reminders** — local notifications honoring each activity's schedule + time
- **Search, detail, edit, soft delete** — full activity lifecycle

## Tech stack

| Layer        | Choice                                      |
|--------------|---------------------------------------------|
| App          | Expo SDK 57, React 19, React Native 0.86    |
| Navigation   | React Navigation (native stack + bottom tabs) |
| Database     | `expo-sqlite` (WAL, hand-written SQL, migrations) |
| State        | `zustand` (+ persist for the creation draft) |
| Notifications| `expo-notifications` (local only)           |
| UI inputs    | `react-native-switch-selector`, `react-native-timer-picker` |

## Getting started

Prerequisites: Node.js (LTS), the Expo Go app or an Android emulator / dev build.

```bash
npm install
npx expo start
```

Then press `a` (Android), `i` (iOS), or `w` (web). Reminder notifications need real
OS scheduling, so use a development build on a physical device to test them.

```bash
npx expo start --android   # run on Android
npx expo start --ios       # run on iOS
```

> First launch asks for notification permission. Denying it only disables reminders;
> everything else keeps working.

## Project structure

```text
App.js                      NavigationContainer + AppNavigator
index.js                    Expo entry
src/
  api/database.js           Re-export shim (import from src/database instead)
  assets/                   Icons, splash, logo (+ optional fonts/)
  components/
    common/                 AppButton, AppSwitch, FormCard, CompletionView
    create-activity/        StepDots, ReviewStep (create wizard + detail reuse)
    execution/              ExecutionShell (shared execution header)
    inputs/                 Time (reminder-time picker)
    schedule-forms/         WeeklyForm, IntervalForm (editors)
    schedule-ui/            WeeklyUi, IntervalUi (read-only badges)
    type-forms/             TimedForm, FollowUpForm, MultiActivitiesForm (editors)
    ActivityCard.js         Shared card (accepts optional footer)
    InfoForm.js / TypeForm.js / ScheduleForm.js
  constants/                activity.js (options, weekdays), logStatus.js
  database/
    connection.js           Open/init/migrate, self-healing handle
    activities.js           Definition CRUD + row mapper
    activityLogs.js         Log CRUD, range/history queries
  hooks/
    useActivityLog.js       Load/create today's log + start/save/complete
    useTaskTimer.js         Shared countdown (Timed + Multi task timers)
  navigation/               AppNavigator (stack), BottomTabNavigator (tabs)
  screens/
    SplashScreen.js         DB init + Today preload + notification resync
    HomeScreen.js           Today: due activities + today's progress
    ActivitiesScreen.js     All definitions list
    ActivityDetailScreen.js Full details + Start / Edit / Delete
    EditActivityScreen.js   Reuses creation forms, same-ID update
    CreateActivityScreen.js 4-step wizard (info → type → schedule → review)
    Normal/Timed/FollowUp/MultiActivityScreen.js  Type execution screens
    SearchScreen.js         Live title/description search
    StatusScreen.js         Week/Month/Year stats + day detail
    SettingsScreen.js
  services/notifications/   Trigger builder + sync/cancel (deterministic IDs)
  store/
    activityStore.js        Definitions + todayEntries cache + CRUD actions
    createActivityDraft.js  Persisted in-progress creation form
  styles/                   theme.js, timerPicker.js (shared picker styles)
  utils/
    activityFilters.js      isDueToday (any date), priority/time sorters
    activityNavigation.js   Type → execution route
    dates.js                Day keys, week/month/year helpers
    formatTime.js           Clock/duration/countdown formatters
    searchActivities.js     Search matcher
    todayEntries.js         Definition+log join, progress summaries
    validateActivity.js     Step validation (create + edit)
```

## Data architecture

Two separate concerns, two storages:

```text
activities        = WHAT the activity is (definition, user-edited)
activity_logs     = WHAT HAPPENED each scheduled day (one row per activity+day)
```

- `activities`: `title, description, priority, type, type_data (JSON), schedule,
  schedule_data (JSON), time (JSON), created_at, status (deprecated), deleted_at`
- `activity_logs`: `activity_id, log_date (YYYY-MM-DD, UNIQUE with activity),
  status (pending/in_progress/completed), progress (0–100), started_at,
  completed_at, data (JSON: timer elapsed / completed step+task ids / task timers),
  activity_title (snapshot, keeps history readable after edits/deletes)`

Rules:

- A missing log for a due day means **pending** — logs are created lazily on first
  real action, never by viewing.
- Each day owns its log row, so timers/progress never leak into other occurrences.
- Deletes are **soft** (`deleted_at`); reads filter them out, history is preserved.
- `activities.status` is deprecated; execution status comes only from logs.

## Key flows

```text
Create:  Home/Activities → Create wizard → validated → stored → alarms synced
Today:   definitions → schedule check → today's log → status/progress → execute
Execute: Detail → Start → type screen → start/progress/complete → log persisted
Edit:    Detail → Edit (prefilled forms) → validate → same-ID update → alarms resynced
Delete:  Detail → confirm → soft delete → hidden everywhere, alarms cancelled
Status:  logs in range → completion % → day strip → per-day breakdown (read-only)
```

Interval semantics: due when N+ days passed since the **last completion**
(creation date if never done); stays due until completed. Alarms follow the same
anchor and are recomputed on completion and every app start.

## Conventions

- Screens own UI/navigation only; SQL lives in `src/database`, shared logic in
  `utils/`/`hooks/`, scheduling in `src/services/notifications`.
- Navigation passes IDs (`activityId`), screens select data from the store.
- No physical `DELETE` exists in the codebase; no new native dependencies without need.
