import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@hooks/ui/useLanguage';
import { getLocalized } from '@utils/localizedText';
import { getCanonicalSiteUrl } from '@utils/slugUtils';
import type { SEOHeadProps } from '@app-types';

const SITE_SUFFIX = ' - TakeOff Info paragliding.borislav.space';
const DEFAULT_TITLE = 'Места за летене с парапланер в България';
const DEFAULT_DESCRIPTION =
  'Информация за места за летене с парапланер в България. Посоки на вятъра, подходящи за излитане, височина на старта, методи за достъп до стартове за летене с парапланер в България.';

export function SEOHead({ config, site }: SEOHeadProps) {
  const { current } = useLanguage();
  const isEn = current === 'en';
  const origin = window.location.origin;

  // Active-language site name (BG is the ultimate fallback)
  const name = getLocalized(site?.title, current);

  const baseTitle = site
    ? isEn
      ? `Paragliding site ${name} in Bulgaria — takeoff info`
      : `Подробна информация за ${name} като място за летене с парапланер в България`
    : config.title || DEFAULT_TITLE;

  const pageTitle = `${baseTitle}${SITE_SUFFIX}`;

  const pageDescription = site
    ? isEn
      ? `Paragliding takeoff ${name}${site.altitude ? ` at ${site.altitude}m` : ''}.${
          site.windDirection?.length ? ` Suitable winds: ${site.windDirection.join(', ')}.` : ''
        } Wind directions, takeoff altitude and access methods for paragliding in Bulgaria.`
      : `Място за летене с парапланер ${name}${
          site.altitude ? ` на ${site.altitude}м височина` : ''
        }. ${
          site.windDirection?.length ? `Подходящи ветрове: ${site.windDirection.join(', ')}.` : ''
        } Посоки на вятъра, подходящи за излитане, височина на старта, методи на достъп до София, старт за летене с парапланер.`
    : config.description || DEFAULT_DESCRIPTION;

  // Self-referencing canonical per language (EN→/en, BG→canonical). hreflang below
  // cross-links the two so neither is treated as duplicate content.
  const canonicalPath = site ? getCanonicalSiteUrl(site, current) : config.canonical;
  const pageUrl = canonicalPath ? `${origin}${canonicalPath}` : window.location.href;
  const bgUrl = site ? `${origin}${getCanonicalSiteUrl(site, 'bg')}` : undefined;
  const enUrl = site ? `${origin}${getCanonicalSiteUrl(site, 'en')}` : undefined;

  const keywords = site
    ? `парапланер, парапланеризъм, bulgaria, paragliding, ${site.title.bg || ''}, ${
        site.title.en || ''
      }`
    : config.keywords || 'парапланер, парапланеризъм, bulgaria, paragliding';

  // Default image for social sharing - convert to .jpg responsive version
  const getImageForSharing = () => {
    if (!site?.galleryImages?.[0]) {
      return `${window.location.origin}/assets/paragliding-bulgaria-og.jpg`;
    }

    const originalPath = site.galleryImages[0].path;
    // Extract just filename and convert to .jpg
    const filename = originalPath.replace(/^.*\//, '');
    const jpgFilename = filename.replace(/\.[^/.]+$/, '') + '.jpg';
    return `${window.location.origin}/gallery/small/${jpgFilename}`;
  };

  const ogImage = getImageForSharing();

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name='description' content={pageDescription} />
      <meta name='keywords' content={keywords} />
      <link rel='canonical' href={pageUrl} />

      {/* hreflang alternates — only for site pages, which exist in both languages */}
      {site && bgUrl && <link rel='alternate' hrefLang='bg' href={bgUrl} />}
      {site && enUrl && <link rel='alternate' hrefLang='en' href={enUrl} />}
      {site && bgUrl && <link rel='alternate' hrefLang='x-default' href={bgUrl} />}

      {/* Open Graph / Facebook Sharing */}
      <meta property='og:title' content={pageTitle} />
      <meta property='og:description' content={pageDescription} />
      <meta property='og:url' content={pageUrl} />
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content='TakeOff Info - Paragliding Bulgaria' />
      <meta property='og:image' content={ogImage} />
      <meta property='og:image:width' content='960' />
      <meta property='og:image:height' content='540' />
      <meta property='og:image:alt' content={site ? (isEn ? `Paragliding site ${name} in Bulgaria` : `Място за летене с парапланер ${name}`) : 'Места за летене с парапланер в България'} />
      <meta property='og:locale' content={isEn ? 'en_US' : 'bg_BG'} />
      <meta property='og:locale:alternate' content={isEn ? 'bg_BG' : 'en_US'} />

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
            name: name || site.title.bg || site.title.en,
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
              image: `${window.location.origin}/gallery/large/${site.galleryImages[0].path.replace(/^.*\//, '').replace(/\.[^/.]+$/, '') + '.jpg'}`,
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
