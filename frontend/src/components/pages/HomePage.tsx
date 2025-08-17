import { SitesMapContainer as SitesMap } from '@containers/SitesMapContainer';
import { SitesListContainer as SitesList } from '@containers/SitesListContainer';
import { WindDirectionFilter } from '@components/main/WindDirectionFilter';
import { Box, Fade } from '@mui/material';
import { SEOHead } from '@components/seo/SEOHead';
import type { HomePageProps } from '@app-types';

export function HomePage({ isListView, showWindFilter, onWindFilterClose }: HomePageProps) {
  const fadeIn = true;

  return (
    <>
      <SEOHead
        config={{
          title: 'Начало',
          description:
            'Открийте най-добрите места за летене с парапланер в България. Интерактивна карта и списък с подробна информация за старт, достъп и условия.',
          keywords: 'парапланер, парапланеризъм, българия, карта, места за летене',
        }}
      />
      <Fade in={fadeIn} timeout={300}>
        <Box
          sx={{ position: 'relative', height: '100vh', width: '100vw', overflowX: 'hidden' }}
        >
          {/* Wind Direction Filter */}
          {showWindFilter && <WindDirectionFilter onClose={onWindFilterClose} />}

          {/* Conditional content */}
          {isListView ? <SitesList /> : <SitesMap />}
        </Box>
      </Fade>
    </>
  );
}
