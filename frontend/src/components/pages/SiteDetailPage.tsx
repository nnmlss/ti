import { SiteDetailViewContainer as SiteDetailView } from '@containers/SiteDetailViewContainer';
import { PageHeader } from '@components/common/PageHeader';
import {
  Container,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { SEOHead } from '@components/seo/SEOHead';
import type { SiteDetailPageProps } from '@app-types';

export function SiteDetailPage({ site, loading, siteId, onClose }: SiteDetailPageProps) {
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
        ...(site && {
          description: `Подробна информация за място за летене ${site.title.bg || site.title.en}`,
          ...(site.url && { canonical: `/sites/${site.url}` })
        })
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