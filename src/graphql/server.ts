import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { Express } from 'express';
import jwt from 'jsonwebtoken';

import { typeDefs } from '@gql-app/types/typeDefs.js';
import { resolvers } from '@gql-app/resolvers/index.js';
import type { GraphQLContext } from '@gql-app/types/context.js';
import { User } from '@models/user.js';

// Create the executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export async function createGraphQLContext({ req }: { req: any }): Promise<GraphQLContext> {
  // GraphQL Yoga uses native Request object, try different ways to get headers
  const authHeader = req.headers?.authorization || req.headers?.get?.('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return { user: null };
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

    // Get user from database
    const user = await User.findOne({ _id: decoded.id, isActive: true });

    if (!user) {
      return { user: null };
    }

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username || '',
        isActive: user.isActive,
        isSuperAdmin: user.isSuperAdmin || false,
      },
    };
  } catch (error) {
    // Invalid token
    return { user: null };
  }
}

export async function setupGraphQLBeforeRoutes(app: Express) {
  // Create GraphQL Yoga server with proper GraphiQL
  const yoga = createYoga({
    schema,
    context: async ({ request }) => {
      return await createGraphQLContext({ req: request });
    },
    graphiql: {
      title: 'Paragliding Sites GraphQL API',
      defaultQuery: `{
  sites {
    id
    title
    altitude
    windDirection
  }
}`,
    },
    // Yoga handles CORS and other middleware automatically
  });

  // Mount the GraphQL server
  app.use('/graphql', yoga);

  console.log('GraphQL Yoga server ready at /graphql');
  console.log('GraphiQL interface available at /graphql');

  return schema;
}

export async function setupGraphQL(app: Express, httpServer: any) {
  // Not needed anymore
  return null;
}
