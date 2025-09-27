import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { getCanonicalSiteUrl } from '@utils/slugUtils';
import type { SitesLinksListProps, FlyingSite } from '@app-types';

export function SitesLinksList({ sites, currentSiteId, onSiteClick }: SitesLinksListProps) {
  // Sort sites alphabetically by Bulgarian title
  const sortedSites = [...sites].sort((a, b) => {
    const titleA = a.title.bg || a.title.en || '';
    const titleB = b.title.bg || b.title.en || '';
    return titleA.localeCompare(titleB, 'bg');
  });

  // Group sites by first letter
  const groupedSites = sortedSites.reduce((acc, site) => {
    const title = site.title.bg || site.title.en || '';
    const firstLetter = title.charAt(0).toUpperCase();

    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(site);
    return acc;
  }, {} as Record<string, FlyingSite[]>);

  if (sites.length === 0) {
    return (
      <Box sx={{ mt: 4, p: 2, textAlign: 'center' }}>
        <Typography variant='body2' color='text.secondary'>
          No sites available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 17, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          alignItems: 'baseline',
          justifyContent: 'center',
          lineHeight: 1.4,
        }}
      >
        {Object.entries(groupedSites)
          .sort(([a], [b]) => a.localeCompare(b, 'bg'))
          .map(([letter, sitesInGroup], groupIndex) => (
            <React.Fragment key={letter}>
              {sitesInGroup.map((site, siteIndex) => {
                const isCurrentSite = site._id === currentSiteId;

                return (
                <React.Fragment key={site._id}>
                  <Link
                    href={isCurrentSite ? undefined : getCanonicalSiteUrl(site)}
                    onClick={isCurrentSite ? undefined : (e) => {
                      e.preventDefault();
                      onSiteClick(getCanonicalSiteUrl(site));
                    }}
                    sx={{
                      cursor: isCurrentSite ? 'default' : 'pointer',
                      textDecoration: 'none',
                      color: isCurrentSite ? 'text.primary' : 'primary.main',
                      fontSize: '0.9rem',
                      fontWeight: isCurrentSite ? 'bold' : 'medium',
                      '&:hover': isCurrentSite ? {} : {
                        textDecoration: 'underline',
                        color: 'primary.dark',
                      },
                    }}
                  >
                    {site.title.bg || site.title.en}
                  </Link>
                  {!(
                    groupIndex === Object.keys(groupedSites).length - 1 &&
                    siteIndex === sitesInGroup.length - 1
                  ) && (
                    <Typography
                      component='span'
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.9rem',
                        mx: 0.5,
                      }}
                    >
                      ·
                    </Typography>
                  )}
                </React.Fragment>
                );
              })}
            </React.Fragment>
          ))}
      </Box>
    </Box>
  );
}
