/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL, // 실제 배포 도메인
  generateRobotsTxt: true,                // robots.txt도 함께 생성
  sitemapSize: 7000,                      // 기본값 사용 가능
  changefreq: 'daily',                    // 페이지 변경 빈도
  priority: 0.7,                          // 우선순위
  trailingSlash: false,                  // URL에 / 붙일지 여부
  exclude: [                             // 제외
    "/admin",
    "/admin/**",     // 하위 경로까지 포함
    "/login",
    "/signup",
  ],
};
