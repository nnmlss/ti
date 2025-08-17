import { SiteDetailPage } from '@components/pages/SiteDetailPage';
import { useSiteDetailPage } from '@hooks/pages/useSiteDetailPage';

export function SiteDetailPageContainer() {
  const { site, loading, siteId, onClose } = useSiteDetailPage();

  return (
    <SiteDetailPage
      site={site}
      loading={loading}
      siteId={siteId}
      onClose={onClose}
    />
  );
}