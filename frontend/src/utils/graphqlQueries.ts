import { gql } from 'graphql-request';

// Minimal fragment for list view - only essential data
export const SITE_LIST_FRAGMENT = gql`
  fragment SiteListFields on FlyingSite {
    id
    title
    url
    location
    windDirection
    accessOptions
    altitude
  }
`;

// Full fragment for detail view - all data
export const SITE_DETAIL_FRAGMENT = gql`
  fragment SiteDetailFields on FlyingSite {
    id
    title
    url
    windDirection
    location
    accessOptions
    altitude
    access
    accomodations {
      bg
      en
    }
    alternatives {
      bg
      en
    }
    galleryImages {
      path
      author
      width
      height
      format
      thumbnail
      small
      large
    }
    landingFields {
      description
      location
    }
    tracklogs
    localPilotsClubs {
      bg
      en
    }
    unique
    monuments
  }
`;

// Query for map/list view - minimal data for all sites
export const GET_SITES_LIST = gql`
  ${SITE_LIST_FRAGMENT}
  query GetSitesList {
    sites {
      ...SiteListFields
    }
  }
`;

// Query for detail view - full data for single site
export const GET_SITE_DETAIL = gql`
  ${SITE_DETAIL_FRAGMENT}
  query GetSiteDetail($id: ID!) {
    site(id: $id) {
      ...SiteDetailFields
    }
  }
`;

// Query for filtered sites (map/list) - minimal data
export const GET_SITES_BY_WIND_DIRECTION = gql`
  ${SITE_LIST_FRAGMENT}
  query GetSitesByWindDirection($directions: [WindDirection!]!) {
    sitesByWindDirection(directions: $directions) {
      ...SiteListFields
    }
  }
`;

// Mutations (use full detail fragment to get updated data)
export const CREATE_SITE = gql`
  ${SITE_DETAIL_FRAGMENT}
  mutation CreateSite($input: CreateSiteInput!) {
    createSite(input: $input) {
      ...SiteDetailFields
    }
  }
`;

export const UPDATE_SITE = gql`
  ${SITE_DETAIL_FRAGMENT}
  mutation UpdateSite($id: ID!, $input: CreateSiteInput!) {
    updateSite(id: $id, input: $input) {
      ...SiteDetailFields
    }
  }
`;

export const UNSET_SITE_FIELDS = gql`
  ${SITE_DETAIL_FRAGMENT}
  mutation UnsetSiteFields($id: ID!, $fields: [String!]!) {
    unsetSiteFields(id: $id, fields: $fields) {
      ...SiteDetailFields
    }
  }
`;

export const DELETE_SITE = gql`
  mutation DeleteSite($id: ID!) {
    deleteSite(id: $id)
  }
`;

// Auth mutations (for future use)
export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      message
      user {
        id
        username
        email
        isActive
        isSuperAdmin
      }
    }
  }
`;

export const REQUEST_ACTIVATION = gql`
  mutation RequestActivation($email: String!) {
    requestActivation(email: $email) {
      success
      message
    }
  }
`;

export const ACTIVATE_ACCOUNT = gql`
  mutation ActivateAccount($token: String!, $username: String!, $password: String!) {
    activateAccount(token: $token, username: $username, password: $password) {
      token
      message
      user {
        id
        username
        email
        isActive
      }
    }
  }
`;

export const CREATE_USER_ACCOUNTS = gql`
  mutation CreateUserAccounts($emails: [String!]!) {
    createUserAccounts(emails: $emails) {
      email
      id
      success
      message
    }
  }
`;

export const VALIDATE_TOKEN = gql`
  query ValidateToken($token: String!) {
    validateToken(token: $token) {
      valid
      message
    }
  }
`;

export const GET_CONSTANTS = gql`
  query GetConstants {
    constants {
      activationTokenExpiryMinutes
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      email
      username
      isActive
      isSuperAdmin
    }
  }
`;
