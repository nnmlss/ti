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
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import { WindDirectionCompass } from './WindDirectionCompass';
import { AccessOptionsView } from './AccessOptionsView';
import { ImageSlideshow } from './ImageSlideshow';
import { LanguageSwitcher } from '@components/main/LanguageSwitcher';
import { SiteDetailMapContainer } from '@containers/SiteDetailMapContainer';
import { SitesLinksListContainer } from '@containers/SitesLinksListContainer';
import { useLanguage } from '@hooks/ui/useLanguage';
import { getLocalized } from '@utils/localizedText';
import { getCanonicalSiteUrl } from '@utils/slugUtils';
import { compactButton } from '@/styles/buttonStyles';
import type { SiteDetailViewProps } from '@app-types';

export function SiteDetailView({
  site,
  onOpenLocation,
  onOpenTracklog,
  onClose,
  onEdit,
  isAuthenticated,
}: SiteDetailViewProps) {
  const { t } = useTranslation();
  const { current } = useLanguage();

  // Single-language body text: show the active language, fall back to the other.
  const renderLocalizedText = (
    text: { bg?: string; en?: string } | undefined,
    label: string
  ) => {
    const value = getLocalized(text, current);
    if (!value) return null;

    return (
      <Box sx={{ mb: 3 }}>
        {label && (
          <Typography variant='h6' gutterBottom color='primary.main'>
            {label}
          </Typography>
        )}
        <Typography variant='body1'>{value}</Typography>
      </Box>
    );
  };

  const renderBilingualArray = (
    data: { bg?: string[]; en?: string[] } | undefined,
    label: string
  ) => {
    const active =
      (current === 'en' ? data?.en : data?.bg)?.filter((item) => item.trim()) ?? [];
    const fallback =
      (current === 'en' ? data?.bg : data?.en)?.filter((item) => item.trim()) ?? [];
    const items = active.length ? active : fallback;

    if (!items.length) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom color='primary.main'>
          {label}
        </Typography>
        {items.map((item, index) => (
          <Typography key={index} variant='body2' sx={{ mb: 1 }}>
            • {item}
          </Typography>
        ))}
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
          {t('siteDetail.landingFields')}
        </Typography>
        {site.landingFields.map((field, index) => {
          const description = getLocalized(field.description, current);

          if (!description && !field.location) return null;

          return (
            <Paper key={index} sx={{ p: 2, mb: 1 }}>
              {description && <Typography variant='body2'>{description}</Typography>}
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
          {t('siteDetail.tracklogs')}
        </Typography>
        {validTracklogs.map((tracklog, index) => (
          <Typography key={index} variant='body2' sx={{ mb: 1 }}>
            <Button
              variant='outlined'
              size='small'
              onClick={() => onOpenTracklog(tracklog)}
              sx={{ mb: 0.5 }}
            >
              {t('siteDetail.tracklog')} {index + 1}
            </Button>
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <>
      <Card sx={{ maxWidth: { xs: '100vw', sm: '98vw' }, mx: 'auto', mb: 1 }}>
        <CardContent sx={{ p: { xs: 1, md: 4 } }}>
          {/* Back Button and Title Section */}
          <Box sx={{ mb: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: { xs: 'space-between', sm: 'space-arround' },
                gap: { xs: 0, sm: 2 },
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button
                  onClick={onClose}
                  sx={{
                    ...compactButton,
                    display: { xs: 'flex' },
                    mr: 0.5,
                  }}
                  aria-label='Go back'
                  variant='outlined'
                >
                  <ArrowBackIcon />
                </Button>
                {isAuthenticated && (
                  <Button
                    onClick={onEdit}
                    sx={{
                      ...compactButton,
                      color: 'secondary.main',
                      borderColor: 'secondary.main',
                    }}
                    aria-label='Edit site'
                    variant='outlined'
                  >
                    <EditIcon />
                  </Button>
                )}
              </Box>

              <Box sx={{ flex: 1, ml: { xs: 0, sm: 5 } }}>
                {/* Title stays bilingual; the active language leads as H1, the
                    other follows as H2 (BG names match road signs/maps). */}
                <Typography
                  variant='h4'
                  component='h1'
                  gutterBottom
                  color='primary.main'
                  sx={{ mb: 0, textAlign: 'center' }}
                >
                  {current === 'en' ? site.title.en || site.title.bg : site.title.bg}
                </Typography>
                {(current === 'en' ? site.title.bg : site.title.en) && (
                  <Typography
                    variant='h5'
                    component='h2'
                    color='text.secondary'
                    sx={{ textAlign: 'center' }}
                  >
                    {current === 'en' ? site.title.bg : site.title.en}
                  </Typography>
                )}
              </Box>

              <Box sx={{ mt: 0, mb: 0, display: 'flex', justifyContent: 'center' }}>
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
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ mb: 3, mt: 0, overflow: 'hidden' }}>
                <SiteDetailMapContainer site={site} />
              </Box>
              {/* Wind Directions & Altitude */}
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
                  {t('siteDetail.accessTitle')}
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
            <Grid size={{ xs: 12, md: 5 }}>
              {/* Image Gallery Slideshow */}
              {site.galleryImages && site.galleryImages.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <ImageSlideshow images={site.galleryImages} />
                </Box>
              )}

              {renderLocalizedText(site.access, '')}
              {renderLocalizedText(site.unique, '')}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {renderLandingFields()}
              {renderLocalizedText(site.monuments, t('siteDetail.monuments'))}
              {renderBilingualArray(site.accomodations, t('siteDetail.accommodation'))}
              {renderBilingualArray(site.alternatives, t('siteDetail.alternatives'))}
              {renderBilingualArray(site.localPilotsClubs, t('siteDetail.localPilotsClubs'))}
            </Grid>
          </Grid>

          <Divider sx={{ mt: 4, mb: 2 }} />

          {/* Detailed Information */}

          {renderTracklogs()}

          {/* Language toggle at the pinky paraglider-wing spot, inside the card.
              Navigates to the site's BG/EN URL so the route drives the language. */}
          <LanguageSwitcher
            bgUrl={getCanonicalSiteUrl(site, 'bg')}
            enUrl={getCanonicalSiteUrl(site, 'en')}
          />
        </CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          {/* <Button
            onClick={onClose}
            sx={{
              ...compactButton,
              display: { xs: 'flex', md: 'none' },
            }}
            aria-label='Go back'
            variant='outlined'
          >
            <ArrowBackIcon />
          </Button> */}
          {isAuthenticated && (
            <Button
              onClick={onEdit}
              sx={{
                ...compactButton,
                color: 'red',
                borderColor: 'secondary.main',
              }}
              aria-label='Edit site'
              variant='outlined'
            >
              <EditIcon />
            </Button>
          )}
        </Box>
      </Card>

      <SitesLinksListContainer />
    </>
  );
}
