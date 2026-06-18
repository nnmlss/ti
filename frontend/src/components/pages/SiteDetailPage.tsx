import { SiteDetailViewContainer as SiteDetailView } from '@containers/SiteDetailViewContainer';
import { Container, CircularProgress, Alert, Box } from '@mui/material';
import { SEOHead } from '@components/seo/SEOHead';
import { NotificationDialog } from '@components/ui/NotificationDialog';
import { getCanonicalSiteUrl } from '@utils/slugUtils';
import { buildDetailTitle } from '@utils/pageTitle';
import { useLanguage } from '@hooks/ui/useLanguage';
import { useTranslation } from 'react-i18next';
import type { SiteDetailPageProps } from '@app-types';

export function SiteDetailPage({ site, loading, siteId, fallbackName, notification, dismissNotification, onClose }: SiteDetailPageProps) {
  const { t } = useTranslation();
  const { current } = useLanguage();

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
        {t('siteDetail.notFoundPre')} <strong>ID: {siteId}</strong>. {t('siteDetail.notFoundPost')}
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
            ...(site.url && { canonical: getCanonicalSiteUrl(site) }),
          }}
          site={site}
        />
      ) : (
        <SEOHead
          config={{
            // Real name from the loaded list (falls back to the URL slug only on a
            // cold deep-link), so the title shown while loading matches the loaded
            // one exactly — no flash, dashes preserved.
            title: buildDetailTitle(fallbackName, current === 'en'),
            description: `Подробна информация за място за летене ${fallbackName} с парапланер в България. Посоки на вятъра, подходящи за излитане, височина на старта, методи на достъп до София, старт за летене с парапланер.`,
          }}
        />
      )}

      <Container
        maxWidth={false}
        sx={{ py: { xs: 0.5, sm: 2 }, minHeight: '100vh', pb: 10, px: { xs: 0.5, sm: 2 } }}
      >
        {renderContent()}
      </Container>

      {notification && (
        <NotificationDialog
          notification={{
            open: true,
            severity: 'success',
            title: notification.title,
            message: notification.message,
          }}
          onClose={dismissNotification}
        />
      )}
    </>
  );
}
