# FitLog — Phase 1 MVP Roadmap (Offline-First)

**Phiên bản:** 1.0  
**Ngày cập nhật:** 26/05/2026  
**Tham chiếu:** [FitLog PRD](./FitLog%20PRD%20(1).md)

---

## 1. Tổng quan Phase 1

### 1.1. Mục tiêu

Xây dựng MVP **Offline-First** cho iPhone (PWA Standalone), cho phép người dùng:

- Quản lý danh mục bài tập (Gym & Calisthenics)
- Ghi nhật ký tập luyện theo ngày (sets: weight × reps)
- Xem lịch sử và thống kê cơ bản (Total Volume)
- Sử dụng app **không cần mạng** tại phòng tập

### 1.2. Phạm vi (In Scope)

| Module | Mô tả |
| :--- | :--- |
| Exercise Master Data | Danh sách mẫu + tạo bài tập custom |
| Daily Workout Session | Session theo ngày, chuyển ngày linh hoạt |
| Set Logging | Nhập weight/reps, Duplicate Set 1 chạm |
| Dashboard | Liệt kê ngày đã tập + card tóm tắt |
| PWA | Serwist SW + manifest iOS standalone |
| UI | Konsta UI theme `ios` + Tailwind CSS |

### 1.3. Ngoài phạm vi (Out of Scope — Phase 2+)

- Cloud sync, tài khoản người dùng
- Biểu đồ phân tích nâng cao, AI gợi ý
- Export/import dữ liệu
- Dark mode (có thể bổ sung sau)

### 1.4. Definition of Done (Phase 1)

- [ ] App mở và hoạt động khi **tắt hoàn toàn mạng**
- [ ] Add to Home Screen trên iPhone → chạy **standalone**, ẩn URL bar
- [ ] CRUD exercise + session + set hoạt động, dữ liệu **persist sau refresh**
- [ ] Duplicate Set tạo set mới với weight/reps giống set trước
- [ ] Dashboard hiển thị đúng: số bài tập, số set, Total Volume
- [ ] Không có Hydration Error trên iOS Safari
- [ ] Deploy thành công lên Vercel

---

## 2. Tech Stack & Kiến trúc

### 2.1. Stack

| Layer | Công nghệ |
| :--- | :--- |
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Library | **Konsta UI** (`konsta`, theme `ios`) |
| State | Zustand + `persist` middleware |
| Storage | LocalStorage (Phase 1) |
| PWA | Serwist |
| Deploy | Vercel |

### 2.2. Konsta UI — Component Mapping

| Tính năng PRD | Konsta Component |
| :--- | :--- |
| Layout trang | `Page`, `Navbar`, `Block` |
| Dashboard list ngày | `List`, `ListItem`, `BlockTitle` |
| Card tóm tắt ngày | `Card`, `Block` |
| Chọn bài tập | `Sheet` (Bottom Sheet) + `List`, `ListItem` |
| Nhập weight/reps | `ListInput` (`inputMode="decimal"`) |
| Nút Duplicate / Add | `Button`, `Fab` |
| Phân loại Gym/Calisthenics | `Segmented` hoặc `Tabs` |
| Tạo exercise custom | `Sheet` + `ListInput` + `Button` |

### 2.3. Cấu trúc thư mục đề xuất

```
fit-log/
├── app/
│   ├── layout.tsx              # Root layout + KonstaProvider
│   ├── page.tsx                # Dashboard (redirect hoặc render trực tiếp)
│   ├── workout/
│   │   └── [date]/
│   │       └── page.tsx        # Workout Editor theo ngày
│   ├── exercises/
│   │   └── page.tsx            # Quản lý danh mục bài tập
│   └── globals.css
├── components/
│   ├── providers/
│   │   └── konsta-provider.tsx # 'use client' — wrap <App theme="ios">
│   ├── dashboard/
│   │   ├── session-list.tsx
│   │   └── session-summary-card.tsx
│   ├── workout/
│   │   ├── set-row.tsx
│   │   ├── exercise-picker-sheet.tsx
│   │   └── duplicate-set-button.tsx
│   └── exercises/
│       └── exercise-form-sheet.tsx
├── lib/
│   ├── store/
│   │   ├── use-fitlog-store.ts # Zustand store chính
│   │   └── types.ts            # Exercise, WorkoutSession, WorkoutSet
│   ├── seed/
│   │   └── default-exercises.ts
│   └── utils/
│       ├── date.ts             # formatDate, parseDate, todayISO
│       ├── volume.ts           # calcTotalVolume, calcSessionStats
│       └── id.ts               # generateId (crypto.randomUUID)
└── public/
    ├── icons/                  # PWA icons (192, 512, apple-touch-icon)
    └── manifest.webmanifest    # hoặc qua Serwist config
```

### 2.4. Quy tắc `'use client'`

Theo PRD, các file sau **bắt buộc** `'use client'` ở dòng đầu:

- Zustand store consumers (components dùng hooks)
- Konsta UI interactive components
- Form nhập liệu, Sheet, Button handlers
- `konsta-provider.tsx`

Server Components chỉ dùng cho layout tĩnh hoặc metadata — Phase 1 có thể **client-heavy** để tránh hydration phức tạp.

---

## 3. Data Model

### 3.1. Types

```typescript
type ExerciseCategory = 'gym' | 'calisthenics';

interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  isCustom?: boolean; // true nếu user tạo
}

interface WorkoutSession {
  id: string;
  date: string;       // ISO date: "2026-05-26"
  notes?: string;
}

interface WorkoutSet {
  id: string;
  sessionId: string;
  exerciseId: string;
  weight: number;     // kg, 0 nếu bodyweight thuần
  reps: number;
  order: number;      // thứ tự trong session
}
```

### 3.2. Zustand Store Shape

```typescript
interface FitLogState {
  exercises: Exercise[];
  sessions: WorkoutSession[];
  sets: WorkoutSet[];

  // Exercise actions
  addExercise: (exercise: Omit<Exercise, 'id'>) => void;
  updateExercise: (id: string, data: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;

  // Session actions
  getOrCreateSession: (date: string) => WorkoutSession;
  updateSessionNotes: (sessionId: string, notes: string) => void;

  // Set actions
  addSet: (sessionId: string, exerciseId: string) => WorkoutSet;
  updateSet: (setId: string, data: Partial<Pick<WorkoutSet, 'weight' | 'reps'>>) => void;
  deleteSet: (setId: string) => void;
  duplicateSet: (setId: string) => WorkoutSet;
}
```

### 3.3. Persist Config

```typescript
persist(store, {
  name: 'fitlog-storage',
  partialize: (state) => ({
    exercises: state.exercises,
    sessions: state.sessions,
    sets: state.sets,
  }),
})
```

### 3.4. Seed Data (Default Exercises)

**Gym:** Bench Press, Squat, Deadlift, Overhead Press, Barbell Row, Romanian Deadlift, Leg Press, Lat Pulldown

**Calisthenics:** Pull-up, Chin-up, Dip, Push-up, Muscle-up, Handstand Push-up, L-sit, Plank

Seed chạy **một lần** khi store rỗng (trong `onRehydrateStorage` hoặc init action).

### 3.5. Business Rules

| Rule | Mô tả |
| :--- | :--- |
| Session uniqueness | Mỗi `date` chỉ có **1** WorkoutSession |
| Set order | `order` tăng dần; khi duplicate, insert ngay sau set gốc và re-index |
| Total Volume | `Σ (weight × reps)` cho tất cả set trong session |
| Calisthenics weighted | Cho phép `weight > 0` (tạ đeo thêm); `weight = 0` = bodyweight |
| Delete exercise | Không xóa nếu còn set tham chiếu (hoặc soft-delete — quyết định Sprint 2) |

---

## 4. Sprint Breakdown

### Sprint 1 — Foundation (Khởi tạo nền tảng)

**Thời lượng ước tính:** 2–3 ngày

#### Tasks

| # | Task | Chi tiết |
| :-: | :--- | :--- |
| 1.1 | Setup Konsta UI | `npm i konsta`. Import `@import 'konsta/react/theme.css'` trong `globals.css`. Tạo `KonstaProvider` wrap `<App theme="ios">`. |
| 1.2 | Setup Zustand | `npm i zustand`. Tạo `types.ts`, store skeleton với persist. |
| 1.3 | Setup Serwist PWA | Cài `@serwist/next`. Config `next.config.ts`. Tạo SW precache + runtime cache. |
| 1.4 | PWA Manifest & Icons | `display: "standalone"`, `orientation: "portrait"`. Icons: 192×192, 512×512, `apple-touch-icon` 180×180. |
| 1.5 | Routing skeleton | Tạo routes: `/` (Dashboard), `/workout/[date]`, `/exercises`. Layout với Konsta `Page` + `Navbar`. |
| 1.6 | Utils cơ bản | `date.ts`, `id.ts`, `volume.ts` — unit logic thuần. |

#### Deliverables

- App chạy `npm run dev` không lỗi
- Konsta theme iOS hiển thị đúng (Navbar, Block, Button demo)
- PWA manifest valid (kiểm tra Chrome DevTools → Application)
- Store persist: ghi/đọc LocalStorage thành công

#### Acceptance Criteria

- [ ] `globals.css` import cả Tailwind và Konsta theme
- [ ] `KonstaProvider` wrap toàn app trong layout
- [ ] Build production (`npm run build`) pass
- [ ] Lighthouse PWA audit: manifest + SW registered

---

### Sprint 2 — State & Data Layer (Quản lý trạng thái)

**Thời lượng ước tính:** 3–4 ngày

#### Tasks

| # | Task | Chi tiết |
| :-: | :--- | :--- |
| 2.1 | Implement Exercise CRUD | `addExercise`, `updateExercise`, `deleteExercise` + validation tên không trùng. |
| 2.2 | Seed default exercises | Load `default-exercises.ts` khi store exercises rỗng. |
| 2.3 | Implement Session logic | `getOrCreateSession(date)` — tạo mới hoặc trả về session existing. |
| 2.4 | Implement Set CRUD | `addSet`, `updateSet`, `deleteSet` với auto-increment `order`. |
| 2.5 | Implement Duplicate Set | Copy `exerciseId`, `weight`, `reps` → insert sau set gốc, re-index `order`. |
| 2.6 | Selectors / computed | `getSessionsWithStats()`, `getSetsBySession(sessionId)`, `getExerciseById(id)`. |
| 2.7 | Dev smoke test page | Trang test tạm (hoặc console) verify CRUD + persist sau F5. |

#### Deliverables

- Store hoàn chỉnh với tất cả actions
- Seed data tự động lần đầu mở app
- Selectors trả về stats cho Dashboard

#### Acceptance Criteria

- [ ] Tạo exercise custom → persist sau refresh
- [ ] `getOrCreateSession("2026-05-26")` idempotent (gọi 2 lần = 1 session)
- [ ] Add 3 sets → `order` = 0, 1, 2
- [ ] Duplicate set #1 → set mới có data giống, `order` = 1, set cũ #2 thành `order` = 2
- [ ] `calcTotalVolume(sessionId)` trả về đúng tổng weight×reps

---

### Sprint 3 — Mobile UI (Giao diện chính)

**Thời lượng ước tính:** 5–7 ngày

#### 3.1. Dashboard (`/`)

| Task | Chi tiết |
| :--- | :--- |
| Session list | Konsta `List` + `ListItem` — mỗi item = 1 ngày có session |
| Summary card | Hiển thị: số exercise unique, tổng sets, Total Volume (kg) |
| Empty state | Block text + Button "Bắt đầu tập hôm nay" → navigate `/workout/[today]` |
| Navigation | Tap ngày → `/workout/[date]` |

#### 3.2. Workout Editor (`/workout/[date]`)

| Task | Chi tiết |
| :--- | :--- |
| Navbar | Title = ngày formatted (vd: "26 Th5 2026"). Nút back → Dashboard |
| Date navigation | Nút prev/next ngày (hoặc date picker đơn giản) |
| Set list | Mỗi set = 1 row: tên exercise, `ListInput` weight, `ListInput` reps |
| Input config | `type="text"`, `inputMode="decimal"` (weight), `inputMode="numeric"` (reps) |
| Add exercise | FAB hoặc Button → mở `ExercisePickerSheet` |
| Duplicate | Icon/Button trên mỗi row → gọi `duplicateSet(setId)` |
| Delete set | Swipe hoặc icon delete (Konsta `ListItem` media/actions) |
| Auto-save | Mỗi thay đổi input → `updateSet` ngay (debounce 300ms optional) |

#### 3.3. Exercise Picker Sheet

| Task | Chi tiết |
| :--- | :--- |
| Konsta `Sheet` | Mở từ bottom, draggable, backdrop |
| Segmented filter | Tab "Gym" / "Calisthenics" / "Tất cả" |
| Search (optional) | `Searchbar` filter theo tên — nice-to-have |
| Select action | Tap exercise → `addSet(sessionId, exerciseId)` → đóng sheet |
| Link tạo mới | "Thêm bài tập mới" → mở `ExerciseFormSheet` |

#### 3.4. Exercise Management (`/exercises`)

| Task | Chi tiết |
| :--- | :--- |
| List exercises | Group theo category |
| Add custom | Sheet form: name + category selector |
| Edit/Delete | Long press hoặc swipe actions |

#### Deliverables

- 3 màn hình hoàn chỉnh: Dashboard, Workout Editor, Exercises
- Bottom Sheet chọn bài tập mượt trên iOS
- Nhập liệu weight/reps với numeric keyboard iOS

#### Acceptance Criteria

- [ ] Dashboard load < 1s trên iPhone (local data)
- [ ] Bottom Sheet mở/đóng mượt, không scroll jank
- [ ] Tap input weight → iOS hiện bàn phím số
- [ ] Duplicate 1 chạm → set mới xuất hiện ngay dưới
- [ ] Touch target tất cả button ≥ 44×44px
- [ ] Safe area insets đúng trên iPhone (notch/Dynamic Island)

---

### Sprint 4 — Release & QA (Phát hành & Kiểm thử)

**Thời lượng ước tính:** 2–3 ngày

#### Tasks

| # | Task | Chi tiết |
| :-: | :--- | :--- |
| 4.1 | Production build | Fix mọi lỗi build/lint. `npm run build` clean. |
| 4.2 | Deploy Vercel | Connect repo, env vars (nếu có), deploy preview + production. |
| 4.3 | iOS PWA install test | Safari → Share → Add to Home Screen. Verify icon, splash, standalone. |
| 4.4 | Offline test tại gym | Tắt Wi-Fi + cellular. Mở app → add sets → refresh → data intact. |
| 4.5 | Edge case QA | Xem checklist bên dưới |
| 4.6 | Cleanup | Xóa dev test pages, dead code. Update README deploy URL. |

#### QA Checklist

| # | Scenario | Expected |
| :-: | :--- | :--- |
| 1 | Mở app offline lần đầu (đã visit online trước) | App load, UI hiển thị |
| 2 | Tạo session mới offline | Session + sets persist |
| 3 | Duplicate 5 lần liên tiếp | 5 sets, order đúng, volume đúng |
| 4 | Chuyển ngày qua lại | Đúng session tương ứng từng ngày |
| 5 | Tạo exercise trùng tên | Validation error hoặc auto-suffix |
| 6 | Refresh Safari tab | Không mất data, không hydration error |
| 7 | Add to Home Screen → mở standalone | Không URL bar, portrait lock |
| 8 | Input weight = 0, reps = 15 (calisthenics) | Volume = 0, vẫn log được |
| 9 | Session rỗng (0 sets) | Dashboard không hiện hoặc hiện "Chưa tập" |
| 10 | LocalStorage full (edge) | Graceful error message (optional) |

#### Deliverables

- Production URL trên Vercel
- QA report (pass/fail từng scenario)
- README cập nhật hướng dẫn cài PWA

#### Acceptance Criteria

- [ ] Tất cả QA checklist pass
- [ ] Không console error trên iOS Safari
- [ ] App usable hoàn toàn offline sau 1 lần load online

---

## 5. Konsta UI Setup Guide (Quick Reference)

### 5.1. Cài đặt

```bash
npm i konsta zustand
npm i -D @serwist/next serwist
```

### 5.2. globals.css

```css
@import 'tailwindcss';
@import 'konsta/react/theme.css';
```

### 5.3. KonstaProvider

```tsx
// components/providers/konsta-provider.tsx
'use client';

import { App } from 'konsta/react';

export function KonstaProvider({ children }: { children: React.ReactNode }) {
  return <App theme="ios">{children}</App>;
}
```

### 5.4. Root Layout

```tsx
// app/layout.tsx
import { KonstaProvider } from '@/components/providers/konsta-provider';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <KonstaProvider>{children}</KonstaProvider>
      </body>
    </html>
  );
}
```

---

## 6. Timeline tổng hợp

```
Tuần 1          Tuần 2          Tuần 3          Tuần 4
├─ Sprint 1 ────┤
                ├─ Sprint 2 ────┤
                                ├──── Sprint 3 ────────────┤
                                                            ├─ Sprint 4 ──┤
```

| Sprint | Thời lượng | Milestone |
| :--- | :--- | :--- |
| Sprint 1 | 2–3 ngày | Nền tảng + PWA skeleton |
| Sprint 2 | 3–4 ngày | Store + CRUD hoàn chỉnh |
| Sprint 3 | 5–7 ngày | UI 3 màn hình chính |
| Sprint 4 | 2–3 ngày | Deploy + QA iPhone |
| **Tổng** | **~3–4 tuần** | **MVP usable offline** |

---

## 7. Rủi ro & Giảm thiểu

| Rủi ro | Mức | Giảm thiểu |
| :--- | :--- | :--- |
| Hydration error (Zustand + SSR) | Cao | Client-only pages; tránh đọc localStorage ở Server Component |
| iOS Safari PWA quirks | Trung bình | Test sớm Sprint 1; tham khảo [firt.dev PWA iOS](https://firt.dev) |
| Konsta Sheet gesture conflict | Thấp | Test trên device thật; fallback dùng Modal nếu cần |
| LocalStorage limit (~5MB) | Thấp | Phase 1 data nhỏ; Phase 2 migrate IndexedDB nếu cần |

---

## 8. Bước tiếp theo sau Phase 1

1. **Phase 2:** PostgreSQL + API sync (`app/api/sync`)
2. IndexedDB thay LocalStorage (dung lượng lớn hơn)
3. Dark mode (Konsta hỗ trợ theme switching)
4. Export CSV/JSON backup
