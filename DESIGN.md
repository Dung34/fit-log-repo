# Đặc tả Thiết kế (Design Specification) - Ứng dụng Thể hình (Fitness App)

Tài liệu này mô tả chi tiết các thành phần thiết kế giao diện người dùng (UI) dựa trên bản mockup ứng dụng theo dõi tập luyện thể hình.

## 1. Tổng quan (Overview)
- **Phong cách thiết kế:** Hiện đại, tối giản (Minimalist), bo góc mềm mại (Soft rounded corners), sử dụng không gian trắng (Whitespace) hiệu quả để tạo cảm giác thoáng đãng.
- **Chủ đề (Theme):** Light mode (Nền sáng) kết hợp với các mảng màu tối (Dark cards) để tạo độ tương phản và các màu neon nhẹ làm điểm nhấn.
- **Đối tượng:** Người dùng theo dõi sức khỏe, tập luyện cá nhân.

## 2. Hệ thống màu sắc (Color Palette)
- **Màu nền (Background):** Trắng (`#FFFFFF`) và Xám rất nhạt (off-white/light gray) cho tổng thể ứng dụng.
- **Màu văn bản (Text):** - Text chính: Đen (`#000000`) hoặc Xám đậm (`#222222`).
  - Text phụ/Ghi chú: Xám nhạt (`#888888`).
  - Text trên nền tối: Trắng (`#FFFFFF`).
- **Màu nhấn (Accent Colors):**
  - **Xanh lá mạ (Neon Green):** `~ #7EEB7B` (Sử dụng cho tag "Cardio", thanh tiến trình, nút Play/Pause, cột biểu đồ highlight ngày hiện tại).
  - **Tím nhạt (Soft Purple):** `~ #A890FE` (Sử dụng cho tag "Strength", biểu đồ nhịp tim).
  - **Vàng cam (Soft Yellow/Orange):** `~ #FFD166` (Sử dụng cho tag "Muscle", icon Calo).
- **Màu Card (Card Backgrounds):**
  - Card chính nổi bật: Xám đen sẫm (`#2C2C2E` hoặc tương tự) để tạo điểm nhấn mạnh (ví dụ: Card "Progress").
  - Card thông tin: Trắng (`#FFFFFF`) với hiệu ứng đổ bóng (Drop shadow) rất nhẹ.

## 3. Typography
- **Font chữ:** Khuyến nghị sử dụng các font Sans-serif hiện đại, bo tròn nhẹ như **Poppins**, **Inter**, hoặc **SF Pro Rounded**.
- **Hệ thống phân cấp (Hierarchy):**
  - **Heading 1 (Tiêu đề màn hình):** Size ~24px, Font weight: Semi-bold/Bold (VD: "Jordan Eagle", "Lower Body", "My Activity").
  - **Heading 2 (Tiêu đề Section):** Size ~18px, Font weight: Medium/Semi-bold (VD: "Progress", "Recommendation", "Statistic").
  - **Body (Nội dung chính):** Size ~14px, Font weight: Regular (VD: Tên bài tập "Pull Up", "Heart Rate").
  - **Caption/Small (Ghi chú nhỏ):** Size ~12px, Font weight: Regular, Màu xám (VD: "3 hours", "Beginner", "15 minutes").

## 4. Các thành phần UI (UI Components)

### 4.1. Buttons & Tags
- **Nút bấm (Buttons):** Hình viên thuốc (Pill-shaped, `border-radius: 50px`). Nút chính thường có màu tối (đen/xám đậm) với text trắng hoặc icon nổi bật.
- **Tags (Nhãn phân loại):** Hình viên thuốc nhỏ, nền màu nhạt (light tinted background) và chữ màu đậm tương ứng (Ví dụ: Tag xanh lá cho Cardio, vàng cho Muscle, tím cho Strength).
- **Vòng tiến trình (Circular Progress):** Sử dụng dạng vòng tròn khuyết với độ dày viền (stroke) lớn, đầu viền bo tròn (round caps).

### 4.2. Cards (Thẻ thông tin)
- Góc bo tròn lớn (`border-radius: ~20px - 24px`).
- **Card Progress (Màn hình Home):** Nền tối, tích hợp vòng tiến trình (Circular progress bar) và nút chuyển hướng.
- **Card Overlay (Màn hình Workout):** Nền kính mờ (Glassmorphism) hoặc gradient trắng xám nhẹ, nổi lên trên hình ảnh/video bài tập, bo góc lớn. Chứa đồng hồ bấm giờ to.
- **Card Grid (Màn hình Activity):** Các thẻ lưới vuông/chữ nhật nền trắng, đổ bóng mờ, chứa biểu đồ đường (Sparkline) hoặc thông số lớn.

## 5. Chi tiết các màn hình (Screen Breakdown)

### Màn hình 1: Trang chủ (Home Screen)
- **Header:** Lời chào ("Welcome back"), Tên người dùng chữ lớn, Avatar người dùng bên phải.
- **Progress Section:** - Thẻ (Card) lớn nổi bật nền đen/xám sẫm.
  - Tag loại bài tập, Tên nhóm cơ (Lower Body), Thời gian, Cấp độ.
  - Vòng tròn tiến độ (72% màu xanh lá).
  - Nút "Continue the workout" dài, hình viên thuốc.
- **Recommendation Section:**
  - Danh sách dạng cuộn dọc (Vertical list).
  - Mỗi item gồm: Hình ảnh thumbnail bo góc vuông (chứa hình người tập), Tên bài tập, Icon thời gian, Icon cấp độ (Vương miện), Tag thể loại bài tập (Cardio, Muscle, Strength) cân lề phải.
- **Bottom Navigation Bar:** Thiết kế nổi (Floating) hoặc bo góc trên, chứa các icon: Home (active), Calendar, Workout/Dumbbell, Premium/Crown.

### Màn hình 2: Đang tập luyện (Workout/Active Screen)
- **Header:** Nút Back (Trở về), Tiêu đề bài tập ("Lower Body"), Nút menu/options (...).
- **Media Area:** Hình ảnh hoặc Video full-width của người mẫu đang tập luyện (ví dụ: gánh tạ), chiếm tỷ lệ lớn diện tích màn hình.
- **Floating Dashboard (Bảng điều khiển nổi):**
  - Nằm ở nửa dưới màn hình, đè lên hình ảnh.
  - Vùng trên: Thời gian chạy lớn (Timer - `00:32:12`) nền xanh lá gradient nhạt, nút Pause tròn bên phải.
  - Vùng dưới: Grid chia đôi cho "Calories" và "Heartrate" (chứa icon nhỏ, text phụ và thông số lớn).
  - Dưới cùng: Biểu đồ đường (Line chart) nhỏ thể hiện nhịp độ/tiến trình màu tím nhạt.

### Màn hình 3: Hoạt động (My Activity)
- **Header:** Nút Back, Tiêu đề "My Activity", Nút menu.
- **Date Selector:** Vuốt ngang chọn ngày (Horizontal scroll), ngày hiện tại ("Today, 23 Oct") được highlight bằng nền viên thuốc màu đen chữ trắng.
- **Stats Grid (Lưới thống kê):**
  - **Heart Rate Card:** Chiếm 1 ô, có biểu đồ đường lượn sóng nhỏ, hiển thị nhịp tim (123 Bpm).
  - **Steps Card:** Chiếm 1/2 ô ngang, hiển thị số bước chân (2316 Steps).
  - **Water Card:** Chiếm 1/2 ô ngang, hiển thị lượng nước (1.8 Liters) với icon giọt nước màu tím.
- **Goal Banner:** Thẻ dẹt, có icon vương miện xanh, text "Completed 2 goals", nút "Detail" nhỏ màu đen.
- **Statistic Chart:** - Tiêu đề "Statistic".
  - Biểu đồ dạng cột (Bar chart) hiển thị dữ liệu theo các ngày trong tuần (Mon - Sun).
  - Cột của ngày hiện tại (Fri) có màu xanh lá nổi bật và hiển thị popup thông số "190 kcal" ở trên đầu. Các cột khác màu tím nhạt.
