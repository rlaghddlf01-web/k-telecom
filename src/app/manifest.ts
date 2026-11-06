import type { MetadataRoute } from 'next';

// "내 휴대폰에 앱 설치하기" 버튼이 동작하도록 홈 화면에 추가할 수 있는 앱 정보
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'K-Telecom',
    short_name: 'K-Telecom',
    description: 'K-Telecom',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1022',
    theme_color: '#0b1022',
    icons: [
      { src: '/pwa-icon/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/pwa-icon/512', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
