import '../globals.css';

// 관리자 화면은 한국어 전용이라 언어 주소(/[lang]) 밖에 두고, 자체 루트 레이아웃을 쓴다.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
