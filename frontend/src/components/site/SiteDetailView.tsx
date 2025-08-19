import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { WindDirectionCompass } from './WindDirectionCompass';
import { AccessOptionsView } from './AccessOptionsView';
import { compactButton } from '@/styles/buttonStyles';
import type { SiteDetailViewProps } from '@app-types';

export function SiteDetailView({
  site,
  onOpenLocation,
  onOpenTracklog,
  onClose,
}: SiteDetailViewProps) {
  const renderLocalizedText = (
    text: { bg?: string; en?: string } | undefined,
    label: string
  ) => {
    if (!text?.bg && !text?.en) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom color='primary.main'>
          {label}
        </Typography>
        {text.bg && (
          <Typography variant='body1'>
            <strong>BG:</strong> {text.bg}
          </Typography>
        )}
        {text.en && (
          <Typography variant='body1'>
            <strong>EN:</strong> {text.en}
          </Typography>
        )}
      </Box>
    );
  };

  const renderBilingualArray = (
    data: { bg?: string[]; en?: string[] } | undefined,
    label: string
  ) => {
    const hasBg = data?.bg?.some((item) => item.trim());
    const hasEn = data?.en?.some((item) => item.trim());

    if (!hasBg && !hasEn) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom color='primary.main'>
          {label}
        </Typography>
        <Grid container spacing={2}>
          {hasBg && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant='subtitle2' gutterBottom>
                Bulgarian:
              </Typography>
              {data!
                .bg!.filter((item) => item.trim())
                .map((item, index) => (
                  <Typography key={index} variant='body2' sx={{ mb: 1 }}>
                    • {item}
                  </Typography>
                ))}
            </Grid>
          )}
          {hasEn && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant='subtitle2' gutterBottom>
                English:
              </Typography>
              {data!
                .en!.filter((item) => item.trim())
                .map((item, index) => (
                  <Typography key={index} variant='body2' sx={{ mb: 1 }}>
                    • {item}
                  </Typography>
                ))}
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  const renderLandingFields = () => {
    if (
      !site.landingFields ||
      !Array.isArray(site.landingFields) ||
      site.landingFields.length === 0
    )
      return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom color='primary.main'>
          Кацалки / Landing Fields
        </Typography>
        {site.landingFields.map((field, index) => {
          const hasBg = field.description?.bg?.trim();
          const hasEn = field.description?.en?.trim();

          if (!hasBg && !hasEn) return null;

          return (
            <Paper key={index} sx={{ p: 2, mb: 1 }}>
              {hasBg && (
                <Typography variant='body2' sx={{ mb: hasEn ? 1 : 0 }}>
                  <strong>BG:</strong> {field.description?.bg}
                </Typography>
              )}
              {hasEn && (
                <Typography variant='body2'>
                  <strong>EN:</strong> {field.description?.en}
                </Typography>
              )}
              {field.location && (
                <Box sx={{ mt: 1 }}>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ display: 'block', mb: 1 }}
                  >
                    Latitude: {field.location.coordinates[1].toFixed(4)}, Longitude:{' '}
                    {field.location.coordinates[0].toFixed(4)}
                  </Typography>
                  <Button
                    size='small'
                    variant='outlined'
                    color='primary'
                    startIcon={<LocationOnIcon />}
                    onClick={() => {
                      const [lng, lat] = field.location!.coordinates;
                      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                    }}
                  >
                    Google Maps
                  </Button>
                </Box>
              )}
            </Paper>
          );
        })}
      </Box>
    );
  };

  const renderTracklogs = () => {
    const validTracklogs = site.tracklogs?.filter((log) => log.trim());
    if (!validTracklogs?.length) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom color='primary.main'>
          Tracklogs
        </Typography>
        {validTracklogs.map((tracklog, index) => (
          <Typography key={index} variant='body2' sx={{ mb: 1 }}>
            <Button
              variant='outlined'
              size='small'
              onClick={() => onOpenTracklog(tracklog)}
              sx={{ mb: 0.5 }}
            >
              Tracklog {index + 1}
            </Button>
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <Card sx={{ maxWidth: { xs: '100vw', sm: '98vw' }, mx: 'auto', mb: 10 }}>
      <CardContent sx={{ p: { xs: 1, md: 4 } }}>
        {/* Back Button and Title Section */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'space-between', sm: 'space-arround' },
              gap: { xs: 0, sm: 2 },
              mb: 2,
            }}
          >
            <Button
              onClick={onClose}
              sx={compactButton}
              aria-label='Go back'
              variant='outlined'
            >
              <ArrowBackIcon />
            </Button>

            <Box sx={{ flex: 1, ml: { xs: 0, sm: 5 } }}>
              <Typography
                variant='h4'
                component='h1'
                gutterBottom
                color='primary.main'
                sx={{ mb: 0, textAlign: 'center' }}
              >
                {site.title.bg}
              </Typography>
              {site.title.en && (
                <Typography
                  variant='h5'
                  component='h2'
                  color='text.secondary'
                  sx={{ textAlign: 'center' }}
                >
                  {site.title.en}
                </Typography>
              )}
            </Box>

            <Box sx={{ mt: 0, mb: 5, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant='contained'
                startIcon={<LocationOnIcon sx={{ mr: { xs: -1, sm: 'unset' }, p: 0 }} />}
                onClick={() => onOpenLocation(site.location.coordinates)}
                sx={{
                  textAlign: 'right',
                  fontSize: { xs: '0.65rem', sm: 'unset' },
                  paddingX: { sx: '5px!important' },
                  ...compactButton,
                }}
              >
                Google
                <br />
                Maps
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Basic Information */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Wind Directions & Altitude */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ textAlign: 'center' }}>
              <WindDirectionCompass windDirections={site.windDirection} size={100} />
              {site.altitude && (
                <Typography variant='h6' sx={{ mt: 2 }}>
                  {site.altitude}m
                </Typography>
              )}
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='h6' gutterBottom color='primary.main'>
                Възможности за достъп
              </Typography>
              <AccessOptionsView
                accessOptions={site.accessOptions}
                size={60}
                showLabels={true}
              />

              {/* Location */}
            </Box>
          </Grid>

          {/* Access Options & Location */}
          <Grid size={{ xs: 12, md: 6 }}>
            {renderLocalizedText(site.access, '')}
            {renderLocalizedText(site.unique, '')}
          </Grid>

          <Grid size={{ xs: 12 }}>
            {renderLandingFields()}
            {renderLocalizedText(site.monuments, 'Забележителности')}
            {renderBilingualArray(site.accomodations, 'Настаняване')}
            {renderBilingualArray(site.alternatives, 'Други занимания')}
            {renderBilingualArray(site.localPilotsClubs, 'Local Pilots Clubs')}
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Detailed Information */}

        {renderTracklogs()}
      </CardContent>
      <Button
        onClick={onClose}
        sx={{
          ...compactButton,
          mb: 5,
          mx: 'auto!important',
          position: 'relative',
          display: { xs: 'flex', md: 'none' },
        }}
        aria-label='Go back'
        variant='outlined'
      >
        <ArrowBackIcon />
      </Button>
    </Card>
  );
}
