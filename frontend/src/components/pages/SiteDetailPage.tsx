import { SiteDetailViewContainer as SiteDetailView } from '@containers/SiteDetailViewContainer';
import { Container, CircularProgress, Alert, Box } from '@mui/material';
import { SEOHead } from '@components/seo/SEOHead';
import { extractSiteNameFromSlug } from '@utils/slugUtils';
import { useParams } from 'react-router-dom';
import type { SiteDetailPageProps } from '@app-types';

export function SiteDetailPage({ site, loading, siteId, onClose }: SiteDetailPageProps) {
  const { slug } = useParams<{ slug?: string }>();

  // Extract site name from URL for SEO (before data loads)
  const fallbackSiteName = slug ? extractSiteNameFromSlug(slug) : 'Място за летене';

  const renderContent = () => {
    // Show loading while fetching individual site data
    if (loading === 'pending') {
      return (
        <Box display='flex' justifyContent='center' p={4}>
          <CircularProgress disableShrink />
        </Box>
      );
    }

    return site ? (
      <SiteDetailView site={site} onClose={onClose} />
    ) : (
      <Alert severity='warning'>
        Не е намерена информация за място с <strong>ID: {siteId}</strong>. Или не съществува,
        или има проблем с интернет връзката към сървъра.
      </Alert>
    );
  };

  return (
    <>
      {site ? (
        <SEOHead
          config={{
            title: `Места за летене с парапланер в България - ${
              site.title.bg || site.title.en
            }`,
            description: `Подробна информация за място за летене ${
              site.title.bg || site.title.en
            }`,
            ...(site.url && { canonical: `/sites/${site.url}` }),
          }}
          site={site}
        />
      ) : (
        <SEOHead
          config={{
            title: `Подробна информация за ${fallbackSiteName} като място за летене с парапланер в България`,
            description: `Подробна информация за място за летене ${fallbackSiteName} с парапланер в България. Посоки на вятъра, подходящи за излитане, височина на старта, методи на достъп до София, старт за летене с парапланер.`,
          }}
        />
      )}

      <Container
        maxWidth={false}
        sx={{ py: { xs: 0.5, sm: 2 }, minHeight: '100vh', pb: 10, px: { xs: 0.5, sm: 2 } }}
      >
        {renderContent()}
      </Container>
    </>
  );
}
