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
        // Don't use mappers for now to avoid conflicts
        // mappers: {
        //   FlyingSite: '@models/sites.js#FlyingSite',
        //   User: '@models/user.js#User',
        // },
        scalars: {
          // Map custom scalars to TypeScript types
          LocalizedText: '@models/sites.js#LocalizedText',
          WindDirection: '@models/sites.js#WindDirection', 
          Location: '@models/sites.js#Location',
          DateTime: 'Date',
        },
        contextType: '@gql-app/types/context.js#GraphQLContext',
        resolverTypeSuffix: 'Resolver',
        allResolversTypeSuffix: 'Resolvers',
      },
    },
  },
};

export default config;