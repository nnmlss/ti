import { SitesMapContainer as SitesMap } from '@containers/SitesMapContainer';
import { SitesListContainer as SitesList } from '@containers/SitesListContainer';
import { SitesLinksListContainer } from '@containers/SitesLinksListContainer';
import { WindDirectionFilter } from '@components/main/WindDirectionFilter';
import { Box, Fade, Typography } from '@mui/material';
import { SEOHead } from '@components/seo/SEOHead';
import { HOME_TITLE } from '@utils/pageTitle';
import type { HomePageProps } from '@app-types';

export function HomePage({ isListView, showWindFilter, onWindFilterClose }: HomePageProps) {
  const fadeIn = true;

  return (
    <>
      <SEOHead
        config={{
          title: HOME_TITLE,
          description:
            'Информация за места за летене с парапланер в България. Посоки на вятъра, подходящи за излитане, височина на старта, методи за достъп до стартове за летене с парапланер в България.',
          keywords: 'парапланер, парапланеризъм, българия, карта, места за летене',
        }}
      />
      <Fade in={fadeIn} timeout={300}>
        <Box sx={{ minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
          {/* Map/list hero — full viewport */}
          <Box sx={{ position: 'relative', height: '100vh', width: '100%' }}>
            {/* SEO H1 — visible overlay over the map; pointer events pass through to the map.
                Map view only — hidden in list view. */}
            {!isListView && (
              <Typography
                component='h1'
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1000,
                  pointerEvents: 'none',
                  m: 0,
                  px: 2,
                  py: 1,
                  maxWidth: 'calc(100% - 32px)',
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  color: 'text.primary',
                  bgcolor: 'rgba(255, 255, 255, 0.82)',
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                Места за летене с парапланер в България
              </Typography>
            )}

            {/* Wind Direction Filter */}
            {showWindFilter && <WindDirectionFilter onClose={onWindFilterClose} />}

            {/* Conditional content */}
            {isListView ? <SitesList /> : <SitesMap />}
          </Box>

          {/* Internal links to all site-detail pages — below the fold, crawlable.
              Hidden in list view, where SitesList already enumerates every site. */}
          {!isListView && (
            <Box sx={{ mt: 1, mb: -7, mx: 1 }}>
              <SitesLinksListContainer />
            </Box>
          )}
        </Box>
      </Fade>
    </>
  );
}
