import { Card, CardContent, Typography, Box, Button, Divider, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { WindDirectionCompass } from './WindDirectionCompass';
import { AccessOptionsView } from './AccessOptionsView';
import type { FlyingSite } from '../types';

interface SiteDetailViewProps {
  site: FlyingSite;
}

export function SiteDetailView({ site }: SiteDetailViewProps) {
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
    if (!site.landingFields || !Array.isArray(site.landingFields)) return null;

    const hasLandingFields = site.landingFields.some(
      (field) =>
        field.description?.bg ||
        field.description?.en ||
        (field.location?.coordinates &&
          field.location.coordinates.some((coord) => coord !== null))
    );

    if (!hasLandingFields) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom color='primary.main'>
          Landing Fields
        </Typography>
        {site.landingFields.map((field, index) => {
          const hasContent =
            field.description?.bg ||
            field.description?.en ||
            (field.location?.coordinates &&
              field.location.coordinates.some((coord) => coord !== null));

          if (!hasContent) return null;

          return (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography variant='subtitle1' gutterBottom>
                Landing Field {index + 1}
              </Typography>

              {(field.description?.bg || field.description?.en) && (
                <Box sx={{ mb: 2 }}>
                  {field.description?.bg && (
                    <Typography variant='body2'>
                      <strong>BG:</strong> {field.description.bg}
                    </Typography>
                  )}
                  {field.description?.en && (
                    <Typography variant='body2'>
                      <strong>EN:</strong> {field.description.en}
                    </Typography>
                  )}
                </Box>
              )}

              {field.location?.coordinates &&
                field.location.coordinates.some((coord) => coord !== null) && (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant='body2'>
                      Coordinates: {field.location.coordinates[1]},{' '}
                      {field.location.coordinates[0]}
                    </Typography>
                    <Button
                      size='small'
                      startIcon={<LocationOnIcon />}
                      onClick={() => {
                        const [lng, lat] = field.location!.coordinates;
                        window.open(`https://maps.google.com/maps?q=${lat},${lng}`, '_blank');
                      }}
                    >
                      View on Map
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
              href={tracklog}
              target='_blank'
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
    <Card sx={{ maxWidth: '98vw', mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        {/* Title Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant='h4' component='h1' gutterBottom color='primary.main'>
            {site.title.bg}
          </Typography>
          {site.title.en && (
            <Typography variant='h5' color='text.secondary' gutterBottom>
              {site.title.en}
            </Typography>
          )}
        </Box>

        {/* Basic Information */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Wind Directions & Altitude */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ textAlign: 'center' }}>
              <WindDirectionCompass
                windDirections={site.windDirection}
                size={120}
                showLabels={true}
              />
              {site.altitude && (
                <Typography variant='h6' sx={{ mt: 2 }}>
                  {site.altitude}m
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Access Options & Location */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='h6' gutterBottom color='primary.main'>
                Методи на достъп
              </Typography>
              <AccessOptionsView accessOptions={site.accessOptions} size={60} />

              {/* Location */}
              <Box sx={{ mt: 3 }}>
                {/* <Typography variant='body1' gutterBottom>
                  <strong>Coordinates:</strong> {site.location.coordinates[1]},{' '}
                  {site.location.coordinates[0]}
                </Typography> */}
                <Button
                  variant='contained'
                  startIcon={<LocationOnIcon />}
                  onClick={() => {
                    const [lng, lat] = site.location.coordinates;
                    window.open(`https://maps.google.com/maps?q=${lat},${lng}`, '_blank');
                  }}
                >
                  View on Google Maps
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Detailed Information */}
        {renderLocalizedText(site.access, 'Достъп')}
        {renderBilingualArray(site.accomodations, 'Настаняване')}
        {renderBilingualArray(site.alternatives, 'Други занимания')}
        {renderBilingualArray(site.localPilotsClubs, 'Local Pilots Clubs')}
        {renderLandingFields()}
        {renderTracklogs()}
      </CardContent>
    </Card>
  );
}
