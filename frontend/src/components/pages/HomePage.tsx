import { SitesMapContainer as SitesMap } from '@containers/SitesMapContainer';
import { SitesList } from '@components/main/SitesList';
import { WindDirectionFilterContainer as WindDirectionFilter } from '@containers/WindDirectionFilterContainer';
import { Box, Fade } from '@mui/material';
import { useHomePage } from '@hooks/pages/useHomePage';
import { SEOHead } from '@components/seo/SEOHead';

export function HomePage() {
  const fadeIn = true;

  const {
    homeView,
    // filter,
    showWindFilter,
    // onViewToggle,
    // onWindFilterToggle,
    onWindFilterClose,
  } = useHomePage();

  const isListView = homeView === 'list';

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
