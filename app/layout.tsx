import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 日本留学院校推荐助手",
  description: "根据学生背景、研究方向、语言成绩和目标偏好，推荐日本大学院申请方案。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
