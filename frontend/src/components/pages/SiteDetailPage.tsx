import { SiteDetailView } from '@components/site/SiteDetailView';
import { PageHeader } from '@components/common/PageHeader';
import {
  Container,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { useSiteDetailPage } from '@hooks/pages/useSiteDetailPage';
import { SEOHead } from '@components/seo/SEOHead';

export function SiteDetailPage() {
  const { site, loading, siteId, onClose } = useSiteDetailPage();
  const renderContent = () => {
    // Show loading while fetching individual site data
    if (loading === 'pending') {
      return (
        <Box display='flex' justifyContent='center' p={4}>
          <CircularProgress disableShrink />
        </Box>
      );
    }

    return site ? (
      <SiteDetailView site={site} />
    ) : (
      <Alert severity='warning'>
        Не е намерена информация за място с <strong>ID: {siteId}</strong>. Или не съществува, или
        има проблем с интернет връзката към сървъра.
      </Alert>
    );
  };

  return (
    <>
      <SEOHead config={{
        title: site ? `${site.title.bg || site.title.en}` : 'Зареждане...',
        description: site ? `Подробна информация за място за летене ${site.title.bg || site.title.en}` : undefined,
        canonical: site?.url ? `/sites/${site.url}` : undefined
      }} site={site || undefined} />
      
      <Container maxWidth={false} sx={{ py: 2, minHeight: '100vh', pb: 10 }}>
        <PageHeader 
          title={site ? (site.title.bg || site.title.en || 'Без име') : 'Зареждане...'} 
          onBackClick={onClose} 
        />
        {renderContent()}
      </Container>
      
    </>
  );
}