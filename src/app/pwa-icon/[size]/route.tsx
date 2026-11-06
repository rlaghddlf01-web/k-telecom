import { ImageResponse } from 'next/og';

const SIZES = new Set([192, 512]);

/** 앱 아이콘 (홈 화면에 추가할 때 쓰는 192·512 이미지) */
export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const size = Number((await params).size);
  if (!SIZES.has(size)) return new Response('Not found', { status: 404 });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1b1550, #e11d48)',
          color: '#fff',
          fontSize: size * 0.5,
          fontWeight: 900,
        }}
      >
        K
      </div>
    ),
    { width: size, height: size },
  );
}
