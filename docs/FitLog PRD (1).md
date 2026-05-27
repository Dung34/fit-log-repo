# **PRODUCT REQUIREMENTS DOCUMENT (PRD)**

**FitLog \- Mobile-First PWA (Next.js Scalable Architecture)**

* **Tên dự án**: FitLog (Ứng dụng ghi chép & phân tích tập luyện cá nhân)  
* **Trạng thái**: Bản thảo nâng cấp (Next.js)  
* **Nền tảng**: PWA (iOS/iPhone Standalone)  
* **Ngày khởi tạo**: 26/05/2026  
* **Công nghệ cốt lõi**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Konsta UI, Zustand, Serwist (PWA)

## **1\. Tổng quan dự án (Project Overview)**

FitLog là ứng dụng web cấp tiến (Progressive Web App \- PWA) được thiết kế chuyên biệt cho mục đích theo dõi và ghi nhận lịch sử tập luyện thể hình (Gym & Calisthenics) hàng ngày. Định hướng phát triển ban đầu tập trung hoàn toàn vào trải nghiệm di động cá nhân (Mobile-First), đảm bảo sự tiện lợi, tốc độ tối đa khi tương tác tại phòng tập ngay cả trong điều kiện không có kết nối mạng (Offline-First).

Việc lựa chọn nền tảng Next.js (App Router) làm kiến trúc cốt lõi nhằm tạo bước đệm vững chắc, cho phép ứng dụng dễ dàng mở rộng sang mô hình Client-Server, tích hợp cơ sở dữ liệu đám mây để đồng bộ hóa và phát triển các module phân tích chuyên sâu (Data Analytics) trong tương lai mà không cần cấu trúc lại toàn bộ mã nguồn.

## **2\. Mục tiêu chiến lược & Lộ trình mở rộng**

**Giai đoạn 1: MVP Offline-First (Hiện tại)** Xây dựng giao diện ứng dụng tối ưu hóa cho màn hình iPhone. Toàn bộ logic lưu trữ chạy ở Client Component ('use client'), dữ liệu được quản lý tập trung qua Zustand Store và đồng bộ trực tiếp vào LocalStorage. Cấu hình thành công Service Worker qua Serwist để cài đặt như app Native.

**Giai đoạn 2: Cloud Sync & Kiến trúc Hybrid (Mở rộng)** Bổ sung tầng dữ liệu với PostgreSQL và Prisma/Drizzle ORM. Triển khai các API Routes ngay tại thư mục app/api/sync để đồng bộ dữ liệu từ thiết bị cục bộ lên Cloud khi có kết nối internet (Background/Manual Sync).

**Giai đoạn 3: Phân tích nâng cao & Trí tuệ nhân tạo (Scale)** Tận dụng Server Components để truy vấn trực tiếp cơ sở dữ liệu nhằm vẽ biểu đồ tiến trình, đánh giá Volume Load, phân tích tần suất tập luyện. Sẵn sàng tích hợp các mô hình LLM thông qua Vercel AI SDK để tự động hóa việc nhận xét, đề xuất lộ trình tăng tạ và tối ưu hóa bài tập dựa trên lịch sử.

## **3\. Yêu cầu tính năng chi tiết (Functional Requirements)**

### **3.1. Quản lý danh mục bài tập (Exercise Master Data)**

* Hệ thống cung cấp danh sách bài tập mẫu thuộc hai nhóm chính: Gym (Bench Press, Squat, Deadlift,...) và Calisthenics (Pull-up, Dip, Muscle-up,...).  
* Cho phép người dùng tạo mới bài tập tùy chỉnh, gán thuộc tính phân loại (Theo mức tạ hoặc Trọng lượng cơ thể).

### **3.2. Ghi chép nhật ký tập luyện (Daily Workout Session)**

* Tự động khởi tạo phiên tập luyện dựa trên ngày hiện tại. Hỗ trợ bộ lọc chuyển đổi ngày linh hoạt để xem hoặc bổ sung lịch sử cũ.  
* Thao tác thêm bài tập vào ngày thông qua giao diện Bottom Sheet/Drawer vuốt chạm mượt mà.  
* Cơ chế nhập liệu tối ưu (Tập trung cao độ):  
  * Mỗi hiệp tập (Set) bao gồm trường nhập: Mức tạ (kg) và Số lượng (Reps). Đối với Calisthenics, hỗ trợ nhập số Reps và mức tạ tăng cường (Weighted) nếu có.  
  * Tự động kích hoạt bàn phím số (Numeric Pad) trên iOS khi người dùng tương tác vào ô nhập liệu bằng thuộc tính inputMode="decimal".  
  * Tính năng Duplicate Set: Cho phép nhân bản nhanh hiệp tập trước đó chỉ bằng một lần chạm, giảm thiểu tối đa thao tác lặp lại khi tập cùng một khối lượng.

### **3.3. Lịch sử hiển thị & Thống kê cơ bản**

* Màn hình Dashboard liệt kê trực quan các ngày đã ghi nhận hoạt động tập luyện.  
* Hiển thị thẻ tóm tắt nhanh cho từng ngày: Tổng số bài tập, số hiệp hoàn thành và tổng khối lượng tích lũy (Total Volume).

## **4\. Kiến trúc kỹ thuật & Cấu trúc dữ liệu**

### **4.1. Sơ đồ dữ liệu Local (State Schema)**

Dữ liệu được tổ chức dưới cấu trúc JSON chuẩn và được quản lý thông qua Zustand Store kết hợp middleware persist:

| Model Name | Fields | Mô tả nhiệm vụ |
| :---- | :---- | :---- |
| **Exercise** | id (string), name (string), category ('gym' | 'calisthenics') | Từ điển lưu trữ danh mục tất cả bài tập. |
| **WorkoutSession** | id (string), date (string), notes (string) | Đại diện cho một ngày tập luyện cụ thể. |
| **WorkoutSet** | id (string), sessionId (string), exerciseId (string), weight (number), reps (integer), order (integer) | Chi tiết từng hiệp tập ứng với bài tập và ngày cố định. |

**Lưu ý kiến trúc Next.js PWA:** Do Next.js thực hiện kết xuất phía Server (SSR) theo mặc định, toàn bộ mã nguồn liên quan đến Zustand Store, LocalStorage và các form nhập liệu bắt buộc phải khai báo chỉ thị 'use client' ở dòng đầu tiên của file nhằm ngăn chặn lỗi Hydration Error.

## **5\. Yêu cầu phi chức năng & Trải nghiệm iOS PWA (Non-Functional)**

* **Độ mượt mà và Giao diện (UI/UX):** Sử dụng Tailwind CSS kết hợp **Konsta UI** (theme `ios`) nhằm tạo giao diện bám sát Human Interface Guidelines của Apple. Konsta cung cấp sẵn các pattern iOS-native như `Page`, `Navbar`, `List`, `Sheet` (Bottom Sheet), `Block`, `ListInput` — phù hợp trải nghiệm mobile-first trên iPhone. Mục tiêu tương tác (Touch Targets) đạt kích thước tối thiểu 44×44 pixel.  
* **Định hình Standalone:** Khai báo tệp manifest.json (hoặc thông qua cấu hình Serwist) với thuộc tính "display": "standalone" và "orientation": "portrait". Khi đưa ra màn hình chính, app sẽ ẩn hoàn toàn thanh URL của trình duyệt Safari, mang lại cảm giác nguyên bản như ứng dụng tải từ App Store.  
* **Khả năng vận hành ngoại tuyến:** Ứng dụng phải hoạt động bình thường kể cả khi thiết bị ngắt kết nối mạng hoàn toàn. Mọi dữ liệu thao tác trong phòng tập được lưu tức thời vào LocalStorage và sẵn sàng đồng bộ lên Server ở các giai đoạn sau.

## **6\. Kế hoạch triển khai kỹ thuật (Implementation Roadmap)**

> Chi tiết đầy đủ từng sprint, task, acceptance criteria và cấu trúc thư mục: xem **[Phase 1 MVP Roadmap](./phase1-mvp-roadmap.md)**.

1. **Sprint 1 (Khởi tạo):** Thiết lập Project Next.js 14+ (App Router, TypeScript). Cài đặt Tailwind CSS và **Konsta UI** (`theme="ios"`). Tích hợp PWA (Serwist) để sinh Service Worker và Manifest tương thích iOS (Apple Touch Icons, `display: standalone`).  
2. **Sprint 2 (Quản lý trạng thái):** Hiện thực hóa cấu trúc dữ liệu bằng Zustand Store + persist LocalStorage. Viết hooks/utilities CRUD cho Exercise, WorkoutSession, WorkoutSet. Seed danh sách bài tập mẫu (Gym & Calisthenics).  
3. **Sprint 3 (Giao diện Mobile):** Xây dựng Dashboard (Konsta `List` + `Card`), màn hình Workout Editor với `Sheet` chọn bài tập, `ListInput` nhập weight/reps (`inputMode="decimal"`), nút Duplicate Set.  
4. **Sprint 4 (Phát hành cá nhân & Thử nghiệm):** Deploy Vercel. Kiểm thử iPhone Safari → Add to Home Screen → test offline tại phòng tập.

