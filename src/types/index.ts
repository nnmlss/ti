// ===== CORE BUSINESS ENTITIES =====
export type {
  WindDirection,
  AccessOptionId,
  LocalizedText,
  Location,
  GalleryImage,
  LandingFieldInfo,
  User,
  FlyingSite,
  CustomError,
} from './entities.js';

// ===== DATABASE TYPES =====
export type {
  UserDocument,
  FlyingSiteDocument,
  CreateSiteData,
} from './database.js';

// ===== GRAPHQL RESOLVER TYPES =====
export type {
  SiteByIdArgs,
  SitesByWindDirectionArgs,
  CreateSiteArgs,
  UpdateSiteArgs,
  DeleteSiteArgs,
  UnsetSiteFieldsArgs,
  LoginArgs,
  RequestActivationArgs,
  ActivateAccountArgs,
  ValidateTokenArgs,
  CreateUserAccountsArgs,
  UpdateProfileArgs,
} from './graphql.js';

// ===== MIDDLEWARE TYPES =====
export type {
  AuthenticatedRequest,
  PublicGraphQLContext,
  AuthenticatedGraphQLContext,
  GraphQLContext,
  YogaInitialContext,
  JWTPayload,
  UserForToken,
} from './middleware.js';

export { isAuthenticatedContext } from './middleware.js';

// ===== SERVICE TYPES =====
export type {
  ImageSize,
  ImagePaths,
  ProcessedImage,
  NodeError,
  MockSharpInstance,
} from './services.js';