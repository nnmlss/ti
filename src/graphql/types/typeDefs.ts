import { gql } from 'graphql-tag';

export const typeDefs = gql`
  # Custom scalars
  scalar LocalizedText
  scalar WindDirection
  scalar Location
  scalar DateTime

  # Your exact types
  type GalleryImage {
    path: String!
    author: String
    width: Int
    height: Int
    format: String
    thumbnail: String
    small: String
    large: String
  }

  type LandingFieldInfo {
    description: LocalizedText
    location: Location
  }

  type LocalizedStringArray {
    bg: [String!]
    en: [String!]
  }

  type FlyingSite {
    id: ID!
    title: LocalizedText!
    url: String
    windDirection: [WindDirection!]!
    location: Location!
    accessOptions: [Int!]!
    altitude: Int
    galleryImages: [GalleryImage!]
    accomodations: LocalizedStringArray
    alternatives: LocalizedStringArray
    access: LocalizedText
    landingFields: [LandingFieldInfo!]
    tracklogs: [String!]
    localPilotsClubs: LocalizedStringArray
    unique: LocalizedText
    monuments: LocalizedText
  }

  type User {
    id: ID!
    email: String!
    username: String
    isActive: Boolean!
    isSuperAdmin: Boolean
  }

  # Input types matching your exact structure
  input GalleryImageInput {
    path: String!
    author: String
    width: Int
    height: Int
    format: String
    thumbnail: String
    small: String
    large: String
  }

  input LandingFieldInfoInput {
    description: LocalizedTextInput
    location: LocationInput
  }

  input LocalizedStringArrayInput {
    bg: [String!]
    en: [String!]
  }

  input CreateSiteInput {
    title: LocalizedTextInput!
    url: String
    windDirection: [WindDirection!]!
    location: LocationInput!
    accessOptions: [Int!]!
    altitude: Int
    galleryImages: [GalleryImageInput!]
    accomodations: LocalizedStringArrayInput
    alternatives: LocalizedStringArrayInput
    access: LocalizedTextInput
    landingFields: [LandingFieldInfoInput!]
    tracklogs: [String!]
    localPilotsClubs: LocalizedStringArrayInput
    unique: LocalizedTextInput
    monuments: LocalizedTextInput
  }

  input LocalizedTextInput {
    bg: String
    en: String
  }

  input LocationInput {
    type: String!
    coordinates: [Float!]!
  }

  # Authentication types
  type AuthPayload {
    token: String!
    user: User!
    message: String!
  }

  type ActivationResponse {
    message: String!
    success: Boolean!
  }

  type TokenValidation {
    valid: Boolean!
    message: String!
  }

  type AccountCreationResult {
    email: String!
    success: Boolean!
    message: String!
    id: String
  }

  type MigrationResult {
    success: Boolean!
    message: String!
    sitesUpdated: Int!
    errors: [String!]!
  }

  type AppConstants {
    activationTokenExpiryMinutes: Int!
  }

  input UpdateProfileInput {
    email: String
    username: String
    password: String
    currentPassword: String!
  }

  # Root types
  type Query {
    # Site queries
    sites: [FlyingSite!]!
    site(id: ID!): FlyingSite
    sitesByWindDirection(directions: [WindDirection!]!): [FlyingSite!]!
    
    # App constants
    constants: AppConstants!
    
    # Auth queries
    validateToken(token: String!): TokenValidation!
  }

  type Mutation {
    # Site mutations
    createSite(input: CreateSiteInput!): FlyingSite!
    updateSite(id: ID!, input: CreateSiteInput!): FlyingSite!
    unsetSiteFields(id: ID!, fields: [String!]!): FlyingSite!
    deleteSite(id: ID!): Boolean!
    
    # Auth mutations
    login(username: String!, password: String!): AuthPayload!
    requestActivation(email: String!): ActivationResponse!
    activateAccount(token: String!, username: String!, password: String!): AuthPayload!
    
    # Admin mutations
    createUserAccounts(emails: [String!]!): [AccountCreationResult!]!
    
    # Super admin migrations
    migrateAddUrls: MigrationResult!
    
    # Profile mutations
    updateProfile(input: UpdateProfileInput!): User!
  }
`;