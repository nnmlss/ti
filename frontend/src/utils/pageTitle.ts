// Agreed page-title copy — one short string reused for the browser tab, Google
// and every social crawler (Telegram/Viber/Facebook/WhatsApp). Kept short on
// purpose: long titles get rewritten/truncated by Google.
//
// ⚠️ DUPLICATED ON THE BACKEND — keep in sync with `buildTitle` in
// `src/middleware/ogMetaMiddleware.ts` (it injects the same title into the raw
// HTML for crawlers). Frontend and backend are separate TS builds (`rootDir`
// per tree) so they can't share a module — if you change a title string here,
// change it there too.

export const HOME_TITLE =
  'Места за летене с парапланер в България - посоки на вятъра и друга полезна информация';

export const buildDetailTitle = (name: string, isEn: boolean): string =>
  isEn
    ? `Paragliding from ${name} | Flying takeoffs in Bulgaria`
    : `Летене с парапланер от ${name} | Информация за стартове за парапланеризъм в България`;
