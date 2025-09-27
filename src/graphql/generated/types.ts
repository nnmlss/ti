import type { LocalizedText } from '@types';
import type { Location } from '@types';
import type { WindDirection } from '@types';
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { GraphQLContext } from '@types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: Date; output: Date; }
  LocalizedText: { input: LocalizedText; output: LocalizedText; }
  Location: { input: Location; output: Location; }
  WindDirection: { input: WindDirection; output: WindDirection; }
};

export type AccountCreationResult = {
  email: Scalars['String']['output'];
  id: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type ActivationResponse = {
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type AppConstants = {
  activationTokenExpiryMinutes: Scalars['Int']['output'];
};

export type AuthPayload = {
  message: Scalars['String']['output'];
  token: Scalars['String']['output'];
  user: User;
};

export type CreateSiteInput = {
  access?: InputMaybe<LocalizedTextInput>;
  accessOptions: Array<Scalars['Int']['input']>;
  accomodations?: InputMaybe<LocalizedStringArrayInput>;
  alternatives?: InputMaybe<LocalizedStringArrayInput>;
  altitude?: InputMaybe<Scalars['Int']['input']>;
  galleryImages?: InputMaybe<Array<GalleryImageInput>>;
  landingFields?: InputMaybe<Array<LandingFieldInfoInput>>;
  localPilotsClubs?: InputMaybe<LocalizedStringArrayInput>;
  location: LocationInput;
  monuments?: InputMaybe<LocalizedTextInput>;
  title: LocalizedTextInput;
  tracklogs?: InputMaybe<Array<Scalars['String']['input']>>;
  unique?: InputMaybe<LocalizedTextInput>;
  url?: InputMaybe<Scalars['String']['input']>;
  windDirection: Array<Scalars['WindDirection']['input']>;
};

export type FlyingSite = {
  access: Maybe<Scalars['LocalizedText']['output']>;
  accessOptions: Array<Scalars['Int']['output']>;
  accomodations: Maybe<LocalizedStringArray>;
  alternatives: Maybe<LocalizedStringArray>;
  altitude: Maybe<Scalars['Int']['output']>;
  galleryImages: Maybe<Array<GalleryImage>>;
  id: Scalars['ID']['output'];
  landingFields: Maybe<Array<LandingFieldInfo>>;
  localPilotsClubs: Maybe<LocalizedStringArray>;
  location: Scalars['Location']['output'];
  monuments: Maybe<Scalars['LocalizedText']['output']>;
  title: Scalars['LocalizedText']['output'];
  tracklogs: Maybe<Array<Scalars['String']['output']>>;
  unique: Maybe<Scalars['LocalizedText']['output']>;
  url: Maybe<Scalars['String']['output']>;
  windDirection: Array<Scalars['WindDirection']['output']>;
};

export type GalleryImage = {
  author: Maybe<Scalars['String']['output']>;
  format: Scalars['String']['output'];
  height: Scalars['Int']['output'];
  path: Scalars['String']['output'];
  width: Scalars['Int']['output'];
};

export type GalleryImageInput = {
  author?: InputMaybe<Scalars['String']['input']>;
  format: Scalars['String']['input'];
  height: Scalars['Int']['input'];
  path: Scalars['String']['input'];
  width: Scalars['Int']['input'];
};

export type LandingFieldInfo = {
  description: Maybe<Scalars['LocalizedText']['output']>;
  location: Maybe<Scalars['Location']['output']>;
};

export type LandingFieldInfoInput = {
  description?: InputMaybe<LocalizedTextInput>;
  location?: InputMaybe<LocationInput>;
};

export type LocalizedStringArray = {
  bg: Maybe<Array<Scalars['String']['output']>>;
  en: Maybe<Array<Scalars['String']['output']>>;
};

export type LocalizedStringArrayInput = {
  bg?: InputMaybe<Array<Scalars['String']['input']>>;
  en?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type LocalizedTextInput = {
  bg?: InputMaybe<Scalars['String']['input']>;
  en?: InputMaybe<Scalars['String']['input']>;
};

export type LocationInput = {
  coordinates: Array<Scalars['Float']['input']>;
  type: Scalars['String']['input'];
};

export type MigrationResult = {
  errors: Array<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  sitesUpdated: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
  updatedUrls: Array<Scalars['String']['output']>;
};

export type Mutation = {
  activateAccount: AuthPayload;
  createSite: FlyingSite;
  createUserAccounts: Array<AccountCreationResult>;
  deleteSite: Scalars['Boolean']['output'];
  login: AuthPayload;
  migrateAddUrls: MigrationResult;
  requestActivation: ActivationResponse;
  unsetSiteFields: FlyingSite;
  updateProfile: User;
  updateSite: FlyingSite;
};


export type MutationActivateAccountArgs = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationCreateSiteArgs = {
  input: CreateSiteInput;
};


export type MutationCreateUserAccountsArgs = {
  emails: Array<Scalars['String']['input']>;
};


export type MutationDeleteSiteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRequestActivationArgs = {
  email: Scalars['String']['input'];
};


export type MutationUnsetSiteFieldsArgs = {
  fields: Array<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateSiteArgs = {
  id: Scalars['ID']['input'];
  input: CreateSiteInput;
};

export type Query = {
  constants: AppConstants;
  site: Maybe<FlyingSite>;
  sites: Array<FlyingSite>;
  sitesByWindDirection: Array<FlyingSite>;
  validateToken: TokenValidation;
};


export type QuerySiteArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySitesByWindDirectionArgs = {
  directions: Array<Scalars['WindDirection']['input']>;
};


export type QueryValidateTokenArgs = {
  token: Scalars['String']['input'];
};

export type TokenValidation = {
  message: Scalars['String']['output'];
  valid: Scalars['Boolean']['output'];
};

export type UpdateProfileInput = {
  currentPassword: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isSuperAdmin: Maybe<Scalars['Boolean']['output']>;
  username: Maybe<Scalars['String']['output']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AccountCreationResult: ResolverTypeWrapper<AccountCreationResult>;
  ActivationResponse: ResolverTypeWrapper<ActivationResponse>;
  AppConstants: ResolverTypeWrapper<AppConstants>;
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateSiteInput: CreateSiteInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  FlyingSite: ResolverTypeWrapper<FlyingSite>;
  GalleryImage: ResolverTypeWrapper<GalleryImage>;
  GalleryImageInput: GalleryImageInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LandingFieldInfo: ResolverTypeWrapper<LandingFieldInfo>;
  LandingFieldInfoInput: LandingFieldInfoInput;
  LocalizedStringArray: ResolverTypeWrapper<LocalizedStringArray>;
  LocalizedStringArrayInput: LocalizedStringArrayInput;
  LocalizedText: ResolverTypeWrapper<Scalars['LocalizedText']['output']>;
  LocalizedTextInput: LocalizedTextInput;
  Location: ResolverTypeWrapper<Scalars['Location']['output']>;
  LocationInput: LocationInput;
  MigrationResult: ResolverTypeWrapper<MigrationResult>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TokenValidation: ResolverTypeWrapper<TokenValidation>;
  UpdateProfileInput: UpdateProfileInput;
  User: ResolverTypeWrapper<User>;
  WindDirection: ResolverTypeWrapper<Scalars['WindDirection']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AccountCreationResult: AccountCreationResult;
  ActivationResponse: ActivationResponse;
  AppConstants: AppConstants;
  AuthPayload: AuthPayload;
  Boolean: Scalars['Boolean']['output'];
  CreateSiteInput: CreateSiteInput;
  DateTime: Scalars['DateTime']['output'];
  Float: Scalars['Float']['output'];
  FlyingSite: FlyingSite;
  GalleryImage: GalleryImage;
  GalleryImageInput: GalleryImageInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  LandingFieldInfo: LandingFieldInfo;
  LandingFieldInfoInput: LandingFieldInfoInput;
  LocalizedStringArray: LocalizedStringArray;
  LocalizedStringArrayInput: LocalizedStringArrayInput;
  LocalizedText: Scalars['LocalizedText']['output'];
  LocalizedTextInput: LocalizedTextInput;
  Location: Scalars['Location']['output'];
  LocationInput: LocationInput;
  MigrationResult: MigrationResult;
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  TokenValidation: TokenValidation;
  UpdateProfileInput: UpdateProfileInput;
  User: User;
  WindDirection: Scalars['WindDirection']['output'];
}>;

export type AccountCreationResultResolver<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AccountCreationResult'] = ResolversParentTypes['AccountCreationResult']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ActivationResponseResolver<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ActivationResponse'] = ResolversParentTypes['ActivationResponse']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AppConstantsResolver<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AppConstants'] = ResolversParentTypes['AppConstants']> = ResolversObject<{
  activationTokenExpiryMinutes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthPayloadResolver<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type FlyingSiteResolver<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['FlyingSite'] = ResolversParentTypes['FlyingSite']> = ResolversObject<{
  access?: Resolver<Maybe<ResolversTypes['LocalizedText']>, ParentType, ContextType>;
  accessOptions?: Resolver<Array<ResolversTypes['Int']>, ParentType, ContextType>;
  accomodations?: Resolver<Maybe<ResolversTypes['LocalizedStringArray']>, ParentType, ContextType>;
  alternatives?: Resolver<Maybe<ResolversTypes['LocalizedStringArray']>, ParentType, ContextType>;
  altitude?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  galleryImages?: Resolver<Maybe<Array<ResolversTypes['GalleryImage']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  landingFields?: Resolver<Maybe<Array<ResolversTypes['LandingFieldInfo']>>, ParentType, ContextType>;
  localPilotsClubs?: Resolver<Maybe<ResolversTypes['LocalizedStringArray']>, ParentType, ContextType>;
  location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  monuments?: Resolver<Maybe<ResolversTypes['LocalizedText']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['LocalizedText'], ParentType, ContextType>;
  tracklogs?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  unique?: Resolver<Maybe<ResolversTypes['LocalizedText']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  windDirection?: Resolver<Array<ResolversTypes['WindDirection']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GalleryImageResolver<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GalleryImage'] = ResolversParentTypes['GalleryImage']> = ResolversObject<{
  author?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  format?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LandingFieldInfoResolver<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['LandingFieldInfo'] = ResolversParentTypes['LandingFieldInfo']> = ResolversObject<{
  description?: Resolver<Maybe<ResolversTypes['LocalizedText']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LocalizedStringArrayResolver<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['LocalizedStringArray'] = ResolversParentTypes['LocalizedStringArray']> = ResolversObject<{
  bg?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  en?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface LocalizedTextScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['LocalizedText'], any> {
  name: 'LocalizedText';
}

export interface LocationScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Location'], any> {
  name: 'Location';
}

export type MigrationResultResolver<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MigrationResult'] = ResolversParentTypes['MigrationResult']> = ResolversObject<{
  errors?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sitesUpdated?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updatedUrls?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolver<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  activateAccount?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationActivateAccountArgs, 'password' | 'token' | 'username'>>;
  createSite?: Resolver<ResolversTypes['FlyingSite'], ParentType, ContextType, RequireFields<MutationCreateSiteArgs, 'input'>>;
  createUserAccounts?: Resolver<Array<ResolversTypes['AccountCreationResult']>, ParentType, ContextType, RequireFields<MutationCreateUserAccountsArgs, 'emails'>>;
  deleteSite?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteSiteArgs, 'id'>>;
  login?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'password' | 'username'>>;
  migrateAddUrls?: Resolver<ResolversTypes['MigrationResult'], ParentType, ContextType>;
  requestActivation?: Resolver<ResolversTypes['ActivationResponse'], ParentType, ContextType, RequireFields<MutationRequestActivationArgs, 'email'>>;
  unsetSiteFields?: Resolver<ResolversTypes['FlyingSite'], ParentType, ContextType, RequireFields<MutationUnsetSiteFieldsArgs, 'fields' | 'id'>>;
  updateProfile?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateProfileArgs, 'input'>>;
  updateSite?: Resolver<ResolversTypes['FlyingSite'], ParentType, ContextType, RequireFields<MutationUpdateSiteArgs, 'id' | 'input'>>;
}>;

export type QueryResolver<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  constants?: Resolver<ResolversTypes['AppConstants'], ParentType, ContextType>;
  site?: Resolver<Maybe<ResolversTypes['FlyingSite']>, ParentType, ContextType, RequireFields<QuerySiteArgs, 'id'>>;
  sites?: Resolver<Array<ResolversTypes['FlyingSite']>, ParentType, ContextType>;
  sitesByWindDirection?: Resolver<Array<ResolversTypes['FlyingSite']>, ParentType, ContextType, RequireFields<QuerySitesByWindDirectionArgs, 'directions'>>;
  validateToken?: Resolver<ResolversTypes['TokenValidation'], ParentType, ContextType, RequireFields<QueryValidateTokenArgs, 'token'>>;
}>;

export type TokenValidationResolver<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TokenValidation'] = ResolversParentTypes['TokenValidation']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  valid?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolver<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isSuperAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface WindDirectionScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['WindDirection'], any> {
  name: 'WindDirection';
}

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  AccountCreationResult?: AccountCreationResultResolver<ContextType>;
  ActivationResponse?: ActivationResponseResolver<ContextType>;
  AppConstants?: AppConstantsResolver<ContextType>;
  AuthPayload?: AuthPayloadResolver<ContextType>;
  DateTime?: GraphQLScalarType;
  FlyingSite?: FlyingSiteResolver<ContextType>;
  GalleryImage?: GalleryImageResolver<ContextType>;
  LandingFieldInfo?: LandingFieldInfoResolver<ContextType>;
  LocalizedStringArray?: LocalizedStringArrayResolver<ContextType>;
  LocalizedText?: GraphQLScalarType;
  Location?: GraphQLScalarType;
  MigrationResult?: MigrationResultResolver<ContextType>;
  Mutation?: MutationResolver<ContextType>;
  Query?: QueryResolver<ContextType>;
  TokenValidation?: TokenValidationResolver<ContextType>;
  User?: UserResolver<ContextType>;
  WindDirection?: GraphQLScalarType;
}>;

