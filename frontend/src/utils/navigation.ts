// Since we no longer use separate routes for map/list, all navigation goes to '/'
export const getHomeUrl = (): string => {
  return '/';
};

export const navigateToHome = (): string => {
  return '/';
};

// Navigation after editing a site - always redirect to site detail page
export const getPostEditNavigationUrl = (site?: { url?: string; _id?: number }): string => {
  // Use the site's canonical URL if available
  if (site?.url) {
    return `/парапланер-старт/${site.url}`;
  }

  // Fallback to generic route if no URL (shouldn't happen)
  if (site?._id) {
    return `/site/${site._id}`;
  }

  // Final fallback to home
  return '/';
};