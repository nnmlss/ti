import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { Express } from 'express';
import type { Server } from 'http';
import jwt from 'jsonwebtoken';

import { typeDefs } from '@gql-app/types/typeDefs.js';
import { resolvers } from '@gql-app/resolvers/index.js';
import type { PublicGraphQLContext, AuthenticatedGraphQLContext, GraphQLContext, YogaInitialContext, JWTPayload } from '@types'
import { User } from '@models/user.js';

// Create the executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export async function createGraphQLContext({ req }: YogaInitialContext): Promise<GraphQLContext> {
  // Check if authorization header exists in different header types
  let authHeader: string;

  if (req.headers && 'authorization' in req.headers && typeof req.headers.authorization === 'string') {
    authHeader = req.headers.authorization;
  } else if (req.headers && 'get' in req.headers && typeof req.headers.get === 'function') {
    const headerValue = req.headers.get('authorization');
    if (!headerValue) {
      return {} as PublicGraphQLContext;
    }
    authHeader = headerValue;
  } else {
    return {} as PublicGraphQLContext;
  }

  // Extract token from "Bearer token123" format
  const token = authHeader.replace('Bearer ', '');

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'fallback-secret') as JWTPayload;

    // Get user from database
    const user = await User.findOne({ _id: decoded.id, isActive: true });

    if (!user) {
      return {} as PublicGraphQLContext;
    }

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username || '',
        isActive: user.isActive,
        isSuperAdmin: user.isSuperAdmin || false,
      },
    } as AuthenticatedGraphQLContext;
  } catch (error) {
    // Invalid token
    return {} as PublicGraphQLContext;
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
    location
    windDirection
    accessOptions
    altitude
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

export async function setupGraphQL(_app: Express, _httpServer: Server) {
  // Not needed anymore
  return null;
}
