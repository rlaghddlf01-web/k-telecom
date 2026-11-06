import PhoneMockup from '@/components/PhoneMockup';
import type { Phone } from '@/lib/phones';

/** 실제 사진(image)이 지정되면 사진을, 없으면 폰 목업을 보여줍니다. */
export default function ProductImage({ phone, className = '' }: { phone: Phone; className?: string }) {
  if (phone.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={phone.image} alt={phone.title} className={`object-contain ${className}`} loading="lazy" />;
  }
  return <PhoneMockup kind={phone.kind} from={phone.from} to={phone.to} className={className} />;
}
