import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/graphql/types/typeDefs.ts',
  generates: {
    './src/graphql/generated/types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        useIndexSignature: true,
        useTypeImports: true,
        extensionsToInclude: ['.ts'],
        strictScalars: true,
        noSchemaStitching: true,
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: true,
        },
        // Don't use mappers for now to avoid conflicts
        // mappers: {
        //   FlyingSite: '@models/sites.js#FlyingSite',
        //   User: '@models/user.js#User',
        // },
        scalars: {
          // Map custom scalars to TypeScript types with strict internal types
          LocalizedText: {
            input: '@types#LocalizedText',
            output: '@types#LocalizedText',
          },
          WindDirection: {
            input: '@types#WindDirection',
            output: '@types#WindDirection',
          },
          Location: {
            input: '@types#Location',
            output: '@types#Location',
          },
          DateTime: {
            input: 'Date',
            output: 'Date',
          },
        },
        contextType: '@types#GraphQLContext',
        resolverTypeSuffix: 'Resolver',
        allResolversTypeSuffix: 'Resolvers',
        // Eliminate framework any types
        omitOperationSuffix: true,
        dedupeOperationSuffix: true,
        skipTypeNameForRoot: true,
        // Disable unused types that contain any
        federation: false,
        skipTypename: true,
        // Exclude subscription types and scalar config interfaces
        excludeScalars: [],
        onlyOperationTypes: false,
      },
    },
  },
};

export default config;