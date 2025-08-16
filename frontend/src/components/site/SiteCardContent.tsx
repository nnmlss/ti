import {
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
import type { FlyingSite } from '@types';
import { WindDirectionCompass } from './WindDirectionCompass';
import { AccessOptionsView } from './AccessOptionsView';
import { useAuth } from '@contexts/AuthContext';

interface SiteCardContentProps {
  site: FlyingSite;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
  onShowOnMap: () => void;
  variant?: 'card' | 'popup';
  compassSize?: number;
}

export function SiteCardContent({
  site,
  onEdit,
  onDelete,
  onViewDetails,
  onShowOnMap,
  variant = 'card',
  compassSize = 75,
}: SiteCardContentProps) {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          cursor: variant === 'card' ? 'pointer' : 'default',
          py: variant === 'popup' ? 2 : undefined,
          px: variant === 'popup' ? 1 : undefined,
        }}
        onClick={variant === 'card' ? onViewDetails : undefined}
      >
        <Typography
          variant={variant === 'popup' ? 'body1' : 'h6'}
          component='div'
          sx={{ 
            mb: 1.5, 
            textAlign: 'center', 
            color: 'primary.light',
            ...(variant === 'popup' && { mb: 1 })
          }}
        >
          {site.title.bg}
          <Typography 
            variant={variant === 'popup' ? 'body2' : 'h6'} 
            component='div' 
            sx={{ 
              textAlign: 'center',
              ...(variant === 'popup' && { color: 'text.secondary' })
            }}
          >
            {site.title.en}
          </Typography>
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <WindDirectionCompass windDirections={site.windDirection} size={compassSize} />
          <Typography 
            variant='body2' 
            sx={{ 
              textAlign: 'center', 
              mt: variant === 'popup' ? 1 : 2 
            }}
          >
            {site.altitude ? `${site.altitude}m` : variant === 'popup' ? 'N/A' : ''}
          </Typography>
        </Box>

        <AccessOptionsView accessOptions={site.accessOptions} size={36} />
      </CardContent>

      <Divider />
      <CardActions sx={{ 
        display: 'flex', 
        justifyContent: isAuthenticated ? 'space-between' : 'center',
        ...(variant === 'popup' && { px: 2, py: 1 })
      }}>
        {isAuthenticated && (
          <Button 
            onClick={variant === 'popup' ? (e) => { e.stopPropagation(); onEdit(); } : onEdit} 
            size='small'
          >
            <EditIcon />
          </Button>
        )}

        <Button 
          onClick={variant === 'popup' ? (e) => { e.stopPropagation(); onShowOnMap(); } : onShowOnMap} 
          size={isAuthenticated ? 'small' : 'medium'}
        >
          <LocationPinIcon sx={{ mr: isAuthenticated ? 0 : 0 }} />
          {!isAuthenticated && 'Отвори в Google Maps'}
        </Button>

        {isAuthenticated && (
          <Button 
            onClick={variant === 'popup' ? (e) => { e.stopPropagation(); onDelete(); } : onDelete} 
            color='error' 
            size='small'
          >
            <DeleteIcon />
          </Button>
        )}
      </CardActions>
    </>
  );
}