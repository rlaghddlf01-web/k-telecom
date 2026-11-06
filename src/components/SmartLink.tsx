import Link from 'next/link';

interface SmartLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
}

/** 사이트 안 주소(/...)는 Link, 바깥 주소(https://)는 새 창 a, tel:/mailto: 는 그대로 */
export default function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^https?:\/\//i.test(href);
  return (
    <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {children}
    </a>
  );
}
