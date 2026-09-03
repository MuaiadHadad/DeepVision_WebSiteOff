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
            background: rgba(65,155,189,.20) !important;
            background-color: rgba(65,155,189,.20) !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            margin-top: 0 !important;
            opacity: 1 !important;
            box-shadow: none !important;
            backdrop-filter: blur(6px) !important;
            -webkit-backdrop-filter: blur(6px) !important;
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
            background: rgba(65,155,189,1) !important;
            background-color: #419bbd !important;
            box-shadow: 0 4px 24px rgba(0,0,0,.25) !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          /* Mobile: always solid */
          @media (max-width: 991.98px) {
            #ftco-navbar,
            .ftco-navbar-light,
            .ftco_navbar {
              background: #419bbd !important;
              background-color: #419bbd !important;
              position: relative !important;
              backdrop-filter: none !important;
            }
          }

          /* Nav links always white */
          #ftco-navbar .nav-link,
          .ftco-navbar-light .nav-link,
          .ftco_navbar .nav-link {
            color: #fff !important;
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
