import { EditSitePage } from '@components/pages/EditSitePage';
import { useEditSitePage } from '@hooks/pages/useEditSitePage';

export function EditSitePageContainer() {
  const { site, loading, siteId, onClose } = useEditSitePage();

  return (
    <EditSitePage
      site={site}
      loading={loading}
      siteId={siteId ?? ''}
      onClose={onClose}
    />
  );
}