import { Helmet } from 'react-helmet-async';
import type { SEOHeadProps } from '@app-types';

const DEFAULT_TITLE = 'Места за летене с парапланер в България';
const SITE_SUFFIX = ' - TakeOff Info ti.borislav.space';
const DEFAULT_DESCRIPTION =
  'Информация за места за летене с парапланер в България. Посоки на вятъра, подходящи за излитане, височина на старта, методи за достъп до стартове за летене с парапланер в България.';

export function SEOHead({ config, site }: SEOHeadProps) {
  const baseTitle = site
    ? `Подробна информация за ${site.title.bg || site.title.en} като място за летене с парапланер в България`
    : config.title || DEFAULT_TITLE;
  
  const pageTitle = `${baseTitle}${SITE_SUFFIX}`;

  const pageDescription = site
    ? `Място за летене с парапланер ${site.title.bg || site.title.en}${
        site.altitude ? ` на ${site.altitude}м височина` : ''
      }. ${
        site.windDirection?.length ? `Подходящи ветрове: ${site.windDirection.join(', ')}.` : ''
      } Посоки на вятъра, подходящи за излитане, височина на старта, методи на достъп до София, старт за летене с парапланер.`
    : config.description || DEFAULT_DESCRIPTION;

  const pageUrl = config.canonical 
    ? `${window.location.origin}${config.canonical}` 
    : window.location.href;
  const keywords = site
    ? `парапланер, парапланеризъм, bulgaria, paragliding, ${site.title.bg || ''}, ${
        site.title.en || ''
      }`
    : config.keywords || 'парапланер, парапланеризъм, bulgaria, paragliding';

  // Default image for social sharing
  const ogImage = site?.galleryImages?.[0]?.small 
    ? `${window.location.origin}/gallery/small/${site.galleryImages[0].path}`
    : `${window.location.origin}/assets/paragliding-bulgaria-og.jpg`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name='description' content={pageDescription} />
      <meta name='keywords' content={keywords} />
      <link rel='canonical' href={pageUrl} />

      {/* Open Graph / Facebook Sharing */}
      <meta property='og:title' content={pageTitle} />
      <meta property='og:description' content={pageDescription} />
      <meta property='og:url' content={pageUrl} />
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content='TakeOff Info - Paragliding Bulgaria' />
      <meta property='og:image' content={ogImage} />
      <meta property='og:image:width' content='960' />
      <meta property='og:image:height' content='540' />
      <meta property='og:image:alt' content={site ? `Място за летене с парапланер ${site.title.bg || site.title.en}` : 'Места за летене с парапланер в България'} />
      <meta property='og:locale' content='bg_BG' />
      <meta property='og:locale:alternate' content='en_US' />

      {/* Twitter Card */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={pageTitle} />
      <meta name='twitter:description' content={pageDescription} />
      <meta name='twitter:image' content={ogImage} />

      {/* Structured data for sites */}
      {site && (
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TouristAttraction',
            name: site.title.bg || site.title.en,
            description: pageDescription,
            geo: site.location
              ? {
                  '@type': 'GeoCoordinates',
                  latitude: site.location.coordinates[1],
                  longitude: site.location.coordinates[0],
                  elevation: site.altitude ? `${site.altitude}m` : undefined,
                }
              : undefined,
            url: pageUrl,
            ...(site.galleryImages?.[0] && {
              image: `${window.location.origin}/gallery/large/${site.galleryImages[0].path}`,
            }),
            touristType: 'Paragliding',
            isAccessibleForFree: true,
            addressCountry: 'BG',
            additionalProperty: site.windDirection?.length ? [
              {
                '@type': 'PropertyValue',
                name: 'Wind Direction',
                value: site.windDirection.join(', '),
              },
            ] : undefined,
          })}
        </script>
      )}
    </Helmet>
  );
}
