import "./globals.css";

export const metadata = {
  title: "CUỘC ĐUA PHÉP NHÂN | Đấu Trường Toán Học Siêu Tốc Độ",
  description: "Trang web game giải toán phép nhân thời gian thực với phong cách BOLD & GAMIFIED BRUTALISM. Kiểm tra tốc độ tính nhẩm của bạn!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="h-full scroll-smooth">
      <body className="min-h-full antialiased selection:bg-brutalist-black selection:text-brutalist-yellow">
        {/* Organic Noise Overlay */}
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
