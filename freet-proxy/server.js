// 프리티 셀프개통 화면 중계 시험 서버 (로컬 전용, 운영에 올리지 않는다).
//
// - 프리티 가입 화면(agent.freet.co.kr)과 서버 요청 주소(agentapi.freet.co.kr)만 중계한다. 다른 주소는 허용하지 않는다.
// - 요청·응답의 내용(본문, 쿠키, 주소 뒤 값)은 저장하거나 기록하지 않는다. 기록하는 것은 경로와 상태 번호뿐이다.
// - 중계한 화면에 구글 번역(구글 웹사이트 번역기)을 붙여서, 주소에 ?tl=vi 처럼 언어를 주면 그 언어로 보여 준다.
// - 본인확인·결제 단계가 중계를 거쳐도 끝까지 동작하는지는 아직 시험하지 않았다. 실제 고객에게 쓰기 전에 프리티 허락이 필요하다.
//
// 실행: node freet-proxy/server.js   →   http://localhost:3200/self/custSel?usimType=U&storeAgentIdKey=<판매점 코드>&tl=vi
const http = require('http');
const https = require('https');

const PORT = Number(process.env.PORT || 3200);
const ALLOWED = { site: 'agent.freet.co.kr', api: 'agentapi.freet.co.kr' };
const stats = [];

/** 프리티 주소를 우리 중계 주소로 바꾼다 (서버 요청 주소는 /__api 경로로 중계) */
function rewrite(body, hostHeader) {
  return body
    .replace(/https?:\\?\/\\?\/agentapi\.freet\.co\.kr/g, `http://${hostHeader}/__api`)
    .replace(/https?:\/\/agent\.freet\.co\.kr/g, `http://${hostHeader}`)
    .replace(/\/\/agent\.freet\.co\.kr/g, `//${hostHeader}`);
}

/** HTML 에 구글 번역을 붙인다: 쿠키 googtrans 로 언어를 정해 두면 구글 번역기가 불러지자마자 번역한다 */
function injectTranslate(html) {
  const head = `
<script>
(function () {
  try {
    var q = new URLSearchParams(location.search);
    var tl = q.get('tl') || sessionStorage.getItem('ft_tl');
    if (tl && /^[a-zA-Z-]{2,8}$/.test(tl)) {
      sessionStorage.setItem('ft_tl', tl);
      document.cookie = 'googtrans=/ko/' + tl + '; path=/';
    }
  } catch (e) {}
})();
function ftGoogleInit() { new google.translate.TranslateElement({ pageLanguage: 'ko', autoDisplay: false }, 'ft_gt'); }
</script>
<script src="https://translate.google.com/translate_a/element.js?cb=ftGoogleInit" async></script>
<style>.goog-te-banner-frame, .skiptranslate iframe { display: none !important } body { top: 0 !important }</style>`;
  const out = html
    // 프리티가 넣어 둔 번역 스크립트는 구글 번역기와 겹치지 않게 뺀다
    .replace(/<script[^>]+cdn\.gtranslate\.net[^>]*><\/script>/gi, '')
    .replace(/<\/head>/i, `${head}\n</head>`)
    .replace(/<body([^>]*)>/i, `<body$1><div id="ft_gt" style="display:none"></div>`);
  return out;
}

function removeParam(url, name) {
  const u = new URL(url, 'http://x');
  u.searchParams.delete(name);
  return u.pathname + (u.search || '');
}

const server = http.createServer((req, res) => {
  if (req.url === '/__log') {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify(stats.slice(-60), null, 1));
  }

  const isApi = req.url.startsWith('/__api');
  const host = isApi ? ALLOWED.api : ALLOWED.site;
  const rawPath = isApi ? req.url.slice('/__api'.length) || '/' : req.url;
  const path = removeParam(rawPath, 'tl'); // 번역 언어 값은 프리티로 보내지 않는다

  const headers = { ...req.headers, host, 'accept-encoding': 'identity', origin: `https://${ALLOWED.site}` };
  if (headers.referer) headers.referer = headers.referer.replace(/^https?:\/\/[^/]+/, `https://${ALLOWED.site}`);

  const up = https.request({ host, path, method: req.method, headers }, (ur) => {
    const type = String(ur.headers['content-type'] || '');
    const h = { ...ur.headers };
    for (const k of ['x-frame-options', 'content-security-policy', 'content-length', 'strict-transport-security']) delete h[k];
    if (h['set-cookie']) {
      h['set-cookie'] = [].concat(h['set-cookie']).map((c) =>
        c.replace(/;\s*Domain=[^;]*/i, '').replace(/;\s*Secure/i, '').replace(/;\s*SameSite=[^;]*/i, '; SameSite=Lax'),
      );
    }
    if (h.location) h.location = rewrite(String(h.location), req.headers.host);
    stats.push({ m: req.method, p: path.split('?')[0].slice(0, 70), s: ur.statusCode });

    if (!/text\/|javascript|json|xml/.test(type)) {
      res.writeHead(ur.statusCode, h);
      return ur.pipe(res);
    }
    const chunks = [];
    ur.on('data', (c) => chunks.push(c));
    ur.on('end', () => {
      let body = rewrite(Buffer.concat(chunks).toString('utf8'), req.headers.host);
      if (/text\/html/.test(type)) body = injectTranslate(body);
      res.writeHead(ur.statusCode, h);
      res.end(body);
    });
  });
  up.on('error', () => {
    stats.push({ err: 'upstream', p: path.split('?')[0].slice(0, 70) });
    res.writeHead(502);
    res.end('proxy error');
  });
  req.pipe(up);
});

server.listen(PORT, '127.0.0.1', () => console.log(`freet proxy test: http://localhost:${PORT} (로컬 전용)`));
