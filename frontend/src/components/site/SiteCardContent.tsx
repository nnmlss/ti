import { CardContent, Typography, CardActions, Button, Box, Divider } from '@mui/material';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '@hooks/auth/useAuth';
import type { SiteCardContentProps } from '@app-types';
import { WindDirectionCompass } from './WindDirectionCompass';
import { AccessOptionsView } from './AccessOptionsView';

export function SiteCardContent({
  site,
  onEdit,
  onDelete,
  onViewDetails,
  onShowOnMap,
  compassSize = 47,
  variant = 'card',
}: SiteCardContentProps) {
  const { isAuthenticated } = useAuth();
  const isPopup = variant === 'popup';
  // Styles - Centralized and reusable
  const cardContentStyles = {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    cursor: 'pointer',
    py: isPopup ? 2 : 1,
    px: isPopup ? 1 : 2,
  };

  const titleStyles = {
    mb: isPopup ? 1 : 1.5,
    textAlign: 'center',
    lineHeight: 1.1,
    color: 'primary.light',
  };

  const subtitleStyles = {
    textAlign: 'center',
    lineHeight: 1.1,
    ...(isPopup && { color: 'text.secondary' }),
  };

  const actionsStyles = {
    display: 'flex',
    justifyContent: isAuthenticated ? 'space-between' : 'center',
    ...(isPopup && { px: 2, py: 1 }),
  };

  // Reusable Google Maps Button Component
  const GoogleMapsButton = ({ showInActions = false }) => (
    <Button onClick={onShowOnMap} size={showInActions && isAuthenticated ? 'small' : 'medium'}>
      <LocationPinIcon sx={{ mr: 0 }} />
      Google Maps
    </Button>
  );

  return (
    <>
      <CardContent sx={cardContentStyles} onClick={onViewDetails}>
        <Typography variant={isPopup ? 'body1' : 'h6'} component='div' sx={titleStyles}>
          {site.title.bg}
          <Typography variant={isPopup ? 'body2' : 'h6'} component='div' sx={subtitleStyles}>
            {site.title.en}
          </Typography>
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <WindDirectionCompass windDirections={site.windDirection} size={compassSize} />
          <Typography
            variant='body2'
            sx={{
              textAlign: 'center',
              mt: isPopup ? 1 : 2,
            }}
          >
            {site.altitude ? `${site.altitude}m` : isPopup ? 'N/A' : ''}
          </Typography>
        </Box>

        <AccessOptionsView accessOptions={site.accessOptions} />

        {isAuthenticated && <Box sx={{ display: { xs: 'none', sm: 'block' } }}><GoogleMapsButton /></Box>}
      </CardContent>

      <Divider />
      <CardActions sx={actionsStyles}>
        {isAuthenticated ? (
          <>
            <Button onClick={onEdit} size='small'>
              <EditIcon />
            </Button>

            <Button onClick={onDelete} color='error' size='small'>
              <DeleteIcon />
            </Button>
          </>
        ) : (
          <GoogleMapsButton showInActions />
        )}
      </CardActions>
    </>
  );
}
