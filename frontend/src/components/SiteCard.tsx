import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Divider,
} from '@mui/material';

import LocationPinIcon from '@mui/icons-material/LocationPin';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import type { FlyingSite } from '../types';
import { WindDirectionCompass } from './WindDirectionCompass';
import { AccessOptionsView } from './AccessOptionsView';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface DeleteDialogState {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface SiteCardProps {
  site: FlyingSite;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
  onShowOnMap: () => void;
  deleteDialog: DeleteDialogState;
}

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
          mb: 2,
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={onViewDetails}
        >
          <Typography
            variant='h5'
            component='div'
            sx={{ mb: 1.5, textAlign: 'center', color: 'primary.light' }}
          >
            {site.title.bg}
            <Typography variant='h6' component='div' sx={{ textAlign: 'center' }}>
              {site.title.en}
            </Typography>
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <WindDirectionCompass
              windDirections={site.windDirection}
              size={75}
            />
            <Typography variant='body2' sx={{ textAlign: 'center', mt: 2 }}>
              {site.altitude ? `${site.altitude}m` : 'N/A'}
            </Typography>
          </Box>
          <AccessOptionsView accessOptions={site.accessOptions} size={46} />
          <Button onClick={onShowOnMap}>
            <LocationPinIcon sx={{ mr: 0 }} />
            Отвори в Google Maps
          </Button>
        </CardContent>
        <Divider />
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onEdit} size='small'>
            <EditIcon />
          </Button>

          <Button onClick={onDelete} color='error' size='small'>
            <DeleteIcon />
          </Button>
        </CardActions>
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
