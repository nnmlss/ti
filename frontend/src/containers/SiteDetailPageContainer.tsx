import { SiteDetailPage } from '@components/pages/SiteDetailPage';
import { useSiteDetailPage } from '@hooks/pages/useSiteDetailPage';

export function SiteDetailPageContainer() {
  const { site, loading, siteId, fallbackName, notification, dismissNotification, onClose } =
    useSiteDetailPage();

  return (
    <SiteDetailPage
      site={site}
      loading={loading}
      siteId={siteId}
      fallbackName={fallbackName}
      notification={notification}
      dismissNotification={dismissNotification}
      onClose={onClose}
    />
  );
}