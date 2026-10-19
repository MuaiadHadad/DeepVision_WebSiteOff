import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  title: "DeepVision",
  description: "",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="512x512" href="/images/favicon_512x512.png" />
        <link rel="stylesheet" href="/legacy/css/deepvision-enhancements.css" />
        <link rel="stylesheet" href="/legacy/css/deepvision-animations.css" />
        <style dangerouslySetInnerHTML={{ __html: `
          /* ── NAVBAR: 20% transparent at top, solid on scroll ── */

          #ftco-navbar,
          #ftco-navbar.ftco-navbar-light,
          .ftco_navbar,
          .ftco-navbar-light {
            background: linear-gradient(90deg, rgba(45,112,138,.98), rgba(58,141,172,.96)) !important;
            background-color: rgb(58,141,172) !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            margin-top: 0 !important;
            opacity: 1 !important;
            border-bottom: 1px solid rgba(105,198,229,.18) !important;
            box-shadow: 0 8px 28px rgba(0,0,0,.18) !important;
            backdrop-filter: blur(10px) saturate(115%) !important;
            -webkit-backdrop-filter: blur(10px) saturate(115%) !important;
            transition: background .35s ease, box-shadow .35s ease, backdrop-filter .35s ease !important;
          }

          /* Scrolled – fully solid */
          #ftco-navbar.scrolled,
          #ftco-navbar.awake,
          #ftco-navbar.ftco-navbar-light.scrolled,
          #ftco-navbar.ftco-navbar-light.awake,
          .ftco_navbar.scrolled,
          .ftco_navbar.awake,
          .ftco-navbar-light.scrolled,
          .ftco-navbar-light.awake {
            background: rgba(45,112,138,.98) !important;
            background-color: rgb(45,112,138) !important;
            box-shadow: 0 4px 24px rgba(0,0,0,.25) !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          /* Mobile: always solid */
          @media (max-width: 991.98px) {
            #ftco-navbar,
            .ftco-navbar-light,
            .ftco_navbar {
              background: rgb(45,112,138) !important;
              background-color: rgb(45,112,138) !important;
              position: fixed !important;
              backdrop-filter: none !important;
            }
          }

          /* Nav links always white */
          #ftco-navbar .nav-link,
          .ftco-navbar-light .nav-link,
          .ftco_navbar .nav-link {
            color: #fff !important;
          }

          /* Home header: transparent over the product hero, solid after scrolling. */
          #ftco-navbar.home-navbar,
          #ftco-navbar.home-navbar.ftco-navbar-light {
            position: fixed !important;
            background: transparent !important;
            background-color: transparent !important;
            border-bottom: 1px solid rgba(255,255,255,.10) !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          #ftco-navbar.home-navbar.scrolled,
          #ftco-navbar.home-navbar.awake {
            position: fixed !important;
            background: rgba(45,112,138,.96) !important;
            background-color: rgba(45,112,138,.96) !important;
            box-shadow: 0 8px 28px rgba(0,0,0,.24) !important;
            backdrop-filter: blur(14px) saturate(125%) !important;
            -webkit-backdrop-filter: blur(14px) saturate(125%) !important;
          }

          @media (max-width: 991.98px) {
            #ftco-navbar.home-navbar,
            #ftco-navbar.home-navbar.ftco-navbar-light {
              position: fixed !important;
              background: transparent !important;
              background-color: transparent !important;
              backdrop-filter: none !important;
              -webkit-backdrop-filter: none !important;
            }

            #ftco-navbar.home-navbar.scrolled,
            #ftco-navbar.home-navbar.awake {
              background: rgba(45,112,138,.96) !important;
              background-color: rgba(45,112,138,.96) !important;
              backdrop-filter: blur(14px) saturate(125%) !important;
              -webkit-backdrop-filter: blur(14px) saturate(125%) !important;
            }
          }
        `}} />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
