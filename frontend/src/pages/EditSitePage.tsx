import { useParams } from 'react-router-dom';
import { useGetSiteQuery } from '../store/apiSlice';
import EditSite from '../components/EditSite';
import { CircularProgress, Alert } from '@mui/material';

export function EditSitePage() {
  const { id } = useParams<{ id: string }>();

  // The 'skip' option prevents the query from running if the id is not available
  const { data: site, error, isLoading } = useGetSiteQuery(id!, { skip: !id });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity='error'>Error loading site data!</Alert>;
  }

  // We pass the fetched site data to the EditSite form
  return site ? <EditSite site={site} /> : <Alert severity='warning'>Site not found.</Alert>;
}
