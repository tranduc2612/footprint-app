# Dấu Chân — album của chúng mình

Album ảnh và video ghi lại những chuyến đi, địa điểm đã ghé qua và các khoảnh khắc đáng nhớ. Giao diện hỗ trợ tiếng Việt và tiếng Anh.

## Tính năng

- Duyệt album theo địa điểm và năm, mở trang riêng cho từng chuyến đi.
- Xem ảnh toàn màn hình và chuyển ảnh trước/sau.
- Xem các ảnh tiêu biểu trong slider Khoảnh khắc.
- Xem các địa điểm trên bản đồ tương tác dùng Leaflet và OpenStreetMap.
- Chuyển Việt/Anh bằng nút ngôn ngữ trên thanh điều hướng. Lựa chọn được lưu trong trình duyệt.
- Giao diện responsive cho điện thoại, máy tính bảng và máy tính.

## Chạy trên máy

Cần cài Node.js và npm.

```bash
npm install
npm run dev
```

Các lệnh thường dùng:

```bash
npm run lint    # Kiểm tra ESLint
npm run build   # Kiểm tra TypeScript và tạo bản build trong dist/
npm run preview # Xem thử bản build sau khi chạy npm run build
```

## Cập nhật chuyến đi và ảnh

Metadata của album nằm trong [`src/content/archive.json`](src/content/archive.json). Ảnh được lưu tập trung trong `public/media/` và được tham chiếu bằng đường dẫn bắt đầu bằng `/media/`.

- Ảnh của từng chuyến đi: thêm vào thư mục phù hợp trong `public/media/`, rồi cập nhật `cover` và `images` của chuyến đi trong `archive.json`.
- Ảnh trang đầu: lưu trong `public/media/home-pic/` và cập nhật `heroImage`.
- Ảnh tiêu biểu ở cuối trang: lưu trong `public/media/memorable/` và cập nhật danh sách `gallery`. Thư mục này chỉ chứa những ảnh được chọn làm khoảnh khắc tiêu biểu.
- Khi thêm địa điểm mới, cập nhật cả `places` và dữ liệu chuyến đi liên quan. Tọa độ bản đồ dùng `latitude` và `longitude`.
- `stats` trong `archive.json` cung cấp số địa điểm, chuyến đi và khoảnh khắc hiển thị ở phần tổng quan.

Ảnh JPEG, PNG và WebP phù hợp để hiển thị trên web. Khi thêm một chuyến đi, giữ `id` ở dạng có ngày ISO cuối chuỗi, ví dụ `ninhbinh-2026-03-21`; ứng dụng dùng ngày này để định dạng ngày trong tiếng Anh.

## Bản dịch

Từ điển, bộ đổi ngôn ngữ và các hàm định dạng nằm trong [`src/content/language.tsx`](src/content/language.tsx). Tiếng Việt là ngôn ngữ mặc định. Khi bổ sung nội dung giao diện, hãy thêm bản dịch cho cả `vi` và `en`. Tên địa điểm tiếng Anh, mô tả ảnh tiêu biểu và cách định dạng ngày cũng được quản lý tại đây.

## Cấu trúc chính

```text
src/
  App.tsx                  # Routes và LanguageProvider
  pages/                   # Trang chủ và trang chi tiết chuyến đi
  components/              # Thẻ album, bản đồ, footer, lightbox
  content/archive.json     # Metadata chuyến đi và gallery
  content/archive.ts       # Nạp dữ liệu và tạo URL theo base path
  content/language.tsx     # Bản dịch Việt/Anh và language context
  App.css                  # Kiểu giao diện
  index.css                # Kiểu toàn cục
public/media/              # Ảnh album, ảnh trang đầu và ảnh tiêu biểu
.github/workflows/         # Tự deploy GitHub Pages
```

## Deploy

GitHub Actions tự chạy workflow `Deploy to GitHub Pages` khi có commit mới trên nhánh `main`. Workflow cài dependencies bằng `npm ci`, chạy build, giữ hỗ trợ deep link của React Router qua `dist/404.html`, rồi deploy GitHub Pages.

Ứng dụng được cấu hình base path `/memorable-app/` trên GitHub Pages. Không đổi cấu hình `base` trong `vite.config.ts` nếu chưa cập nhật nơi deploy.

Trang đang deploy: [tranduc2612.github.io/memorable-app](https://tranduc2612.github.io/memorable-app/).
