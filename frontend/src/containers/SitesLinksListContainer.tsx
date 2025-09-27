import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SitesLinksList } from '@components/site/SitesLinksList';
import { selectAllSites } from '@store/slices/allSitesSlice';
import type { RootState } from '@store/store';

export function SitesLinksListContainer() {
  const sites = useSelector(selectAllSites);
  const currentSite = useSelector((state: RootState) => state.singleSite.data);
  const navigate = useNavigate();

  const handleSiteClick = (canonicalUrl: string) => {
    navigate(canonicalUrl);
  };

  return (
    <SitesLinksList
      sites={sites}
      currentSiteId={currentSite?._id || 0}
      onSiteClick={handleSiteClick}
    />
  );
}