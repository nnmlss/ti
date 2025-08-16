import { Helmet } from 'react-helmet-async';
import type { SEOConfig, FlyingSite } from '@types';

const DEFAULT_TITLE = 'Места за летене с парапланер в България';
const DEFAULT_DESCRIPTION = 'Открийте най-добрите места за летене с парапланер в България. Подробна информация за старт, достъп, височина, посока на вятър и условия за всяко място.';

interface SEOHeadProps {
  config: SEOConfig;
  site?: FlyingSite;
}

export function SEOHead({ config, site }: SEOHeadProps) {
  const pageTitle = site 
    ? `${site.title.bg || site.title.en} - ${DEFAULT_TITLE}`
    : config.title 
    ? `${config.title} - ${DEFAULT_TITLE}`
    : DEFAULT_TITLE;

  const pageDescription = site
    ? `Място за летене с парапланер ${site.title.bg || site.title.en}${site.altitude ? ` на ${site.altitude}м височина` : ''}. ${site.windDirection?.length ? `Подходящи ветрове: ${site.windDirection.join(', ')}.` : ''}`
    : config.description || DEFAULT_DESCRIPTION;

  const pageUrl = config.canonical || window.location.href;
  const keywords = site
    ? `парапланер, парапланеризъм, bulgaria, paragliding, ${site.title.bg || ''}, ${site.title.en || ''}`
    : config.keywords || 'парапланер, парапланеризъм, bulgaria, paragliding';

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Paragliding Bulgaria" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      
      {/* Structured data for sites */}
      {site && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Place",
            "name": site.title.bg || site.title.en,
            "description": pageDescription,
            "geo": site.location ? {
              "@type": "GeoCoordinates",
              "latitude": site.location.coordinates[1],
              "longitude": site.location.coordinates[0]
            } : undefined,
            "elevation": site.altitude ? `${site.altitude}m` : undefined,
            "url": pageUrl
          })}
        </script>
      )}
    </Helmet>
  );
}