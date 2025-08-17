import { AddSitePage } from '@components/pages/AddSitePage';
import { useAddSitePage } from '@hooks/pages/useAddSitePage';

export function AddSitePageContainer() {
  const { onClose } = useAddSitePage();

  return (
    <AddSitePage
      onClose={onClose}
    />
  );
}