// GraphQL response types for sites and errors

// ===== GRAPHQL ERROR TYPES =====
export interface GraphQLError {
  message: string;
  extensions?: {
    code?: string;
  };
}

export interface GraphQLErrorResponse {
  response?: {
    errors?: GraphQLError[];
  };
  message?: string;
}

// ===== GRAPHQL SITE TYPES =====
export interface GraphQLSite {
  id: string;
  title: { bg?: string; en?: string };
  windDirection: string[];
  location: { type: string; coordinates: number[] };
  accessOptions: number[];
  altitude?: number | null;
  access?: { bg?: string; en?: string } | null;
  accomodations?: { bg?: string[]; en?: string[] } | null;
  alternatives?: { bg?: string[]; en?: string[] } | null;
  galleryImages?: Array<{
    path: string;
    author?: string | null;
    width?: number | null;
    height?: number | null;
    format?: string | null;
    thumbnail?: string | null;
    small?: string | null;
    large?: string | null;
  }> | null;
  landingFields?: Array<{
    description?: { bg?: string; en?: string } | null;
    location?: { type: string; coordinates: number[] } | null;
  }> | null;
  tracklogs?: string[] | null;
  localPilotsClubs?: { bg?: string[]; en?: string[] } | null;
  unique?: { bg?: string; en?: string } | null;
  monuments?: { bg?: string; en?: string } | null;
}

// ===== GRAPHQL RESPONSE TYPES =====
export interface GetSiteDetailResponse {
  site: GraphQLSite | null;
}

export interface GetSitesListResponse {
  sites: GraphQLSite[];
}

export interface CreateSiteResponse {
  createSite: GraphQLSite;
}

export interface UpdateSiteResponse {
  updateSite: GraphQLSite;
}

export interface UnsetSiteFieldsResponse {
  unsetSiteFields: GraphQLSite;
}