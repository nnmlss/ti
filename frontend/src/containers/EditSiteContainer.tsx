import EditSite from '@components/site/EditSite';
import type { EditSiteContainerProps } from '@app-types';

export function EditSiteContainer({ site, onClose }: EditSiteContainerProps) {
  return (
    <EditSite
      site={site}
      onClose={onClose}
    />
  );
}