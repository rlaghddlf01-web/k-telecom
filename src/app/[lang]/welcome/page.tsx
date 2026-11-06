import type { Metadata } from 'next';
import LanguageGate from '@/components/LanguageGate';

// 광고·QR 등에서 언어 선택 화면으로 바로 들어올 수 있는 주소 (/welcome)
export const metadata: Metadata = { title: 'Choose Your Language | K-Telecom' };

export default function WelcomePage() {
  return <LanguageGate standalone />;
}