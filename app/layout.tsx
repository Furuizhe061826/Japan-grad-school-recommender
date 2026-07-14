import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "哲思学园｜AI 日本大学院申请规划助手",
  description: "哲思学园旗下 Portfolio MVP：基于学生背景、研究方向、语言成绩和目标偏好，生成日本大学院申请方案与导师匹配建议。"
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
