import type { NextConfig } from "next";

// 가입 방법이 셀프개통 하나뿐이라 "가입 방법"(/plans/apply)으로 합쳤다. 예전 셀프개통 주소는 끊기지 않게 임시 이동시킨다.
const LANGS = "ko|kr|en|ja|ru|vi|zh|th|uz|km|ne|my|si|mn|bn|kk|ur|tl|id";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/plans/self", destination: "/plans/apply", permanent: false },
      { source: `/:lang(${LANGS})/plans/self`, destination: "/:lang/plans/apply", permanent: false },
    ];
  },
};

export default nextConfig;