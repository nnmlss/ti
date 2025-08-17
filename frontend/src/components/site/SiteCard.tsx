import { Card } from '@mui/material';
import type { SiteCardProps } from '@app-types';
import { SiteCardContent } from './SiteCardContent';
import { DeleteConfirmDialogContainer as DeleteConfirmDialog } from '@containers/DeleteConfirmDialogContainer';

export function SiteCard({
  site,
  onEdit,
  onDelete,
  onViewDetails,
  onShowOnMap,
  deleteDialog,
}: SiteCardProps) {
  return (
    <>
      <Card
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <SiteCardContent
          site={site}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          onShowOnMap={onShowOnMap}
          variant='card'
        />
      </Card>
      <DeleteConfirmDialog
        open={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        siteId={site._id}
        title={site.title.bg || site.title.en || 'this site'}
        onConfirm={deleteDialog.onConfirm}
      />
    </>
  );
}
