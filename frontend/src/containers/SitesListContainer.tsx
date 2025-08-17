import { SitesList } from '@components/main/SitesList';
import { useSites } from '@hooks/business/useSites';

export function SitesListContainer() {
  const { sites, allSitesLoadState } = useSites();
  const loading = allSitesLoadState.status;
  const error = allSitesLoadState.error;

  return (
    <SitesList
      sites={sites}
      loading={loading}
      error={error}
    />
  );
}