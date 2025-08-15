import { GraphQLScalarType, GraphQLError } from 'graphql';
import { Kind } from 'graphql/language/index.js';

// Your WindDirection enum values
const WIND_DIRECTIONS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
] as const;

export const LocalizedTextScalar = new GraphQLScalarType({
  name: 'LocalizedText',
  description: 'Localized text with bg and en properties',
  serialize(value: any) {
    // Convert internal value to JSON for client
    if (value && typeof value === 'object' && ('bg' in value || 'en' in value)) {
      return value;
    }
    throw new GraphQLError('LocalizedText must be an object with bg and/or en properties');
  },
  parseValue(value: any) {
    // Convert input from client
    if (value && typeof value === 'object' && ('bg' in value || 'en' in value)) {
      return value;
    }
    throw new GraphQLError('LocalizedText must be an object with bg and/or en properties');
  },
  parseLiteral(ast) {
    // Parse literal value from query
    if (ast.kind === Kind.OBJECT) {
      const value: any = {};
      ast.fields.forEach(field => {
        if (field.name.value === 'bg' || field.name.value === 'en') {
          if (field.value.kind === Kind.STRING) {
            value[field.name.value] = field.value.value;
          }
        }
      });
      if ('bg' in value || 'en' in value) {
        return value;
      }
    }
    throw new GraphQLError('LocalizedText must be an object with bg and/or en properties');
  },
});

export const WindDirectionScalar = new GraphQLScalarType({
  name: 'WindDirection',
  description: 'Wind direction enum (N, NE, E, SE, S, SW, W, NW, etc.)',
  serialize(value: any) {
    if (typeof value === 'string' && WIND_DIRECTIONS.includes(value as any)) {
      return value;
    }
    throw new GraphQLError(`WindDirection must be one of: ${WIND_DIRECTIONS.join(', ')}`);
  },
  parseValue(value: any) {
    if (typeof value === 'string' && WIND_DIRECTIONS.includes(value as any)) {
      return value;
    }
    throw new GraphQLError(`WindDirection must be one of: ${WIND_DIRECTIONS.join(', ')}`);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING && WIND_DIRECTIONS.includes(ast.value as any)) {
      return ast.value;
    }
    throw new GraphQLError(`WindDirection must be one of: ${WIND_DIRECTIONS.join(', ')}`);
  },
});

export const LocationScalar = new GraphQLScalarType({
  name: 'Location',
  description: 'GeoJSON Point location with type and coordinates',
  serialize(value: any) {
    // Convert internal value (your Location type) to JSON for client
    if (value && 
        value.type === 'Point' && 
        Array.isArray(value.coordinates) && 
        value.coordinates.length === 2 &&
        typeof value.coordinates[0] === 'number' &&
        typeof value.coordinates[1] === 'number') {
      return value;
    }
    throw new GraphQLError('Location must be a GeoJSON Point with type "Point" and coordinates array');
  },
  parseValue(value: any) {
    // Convert input from client
    if (value && 
        value.type === 'Point' && 
        Array.isArray(value.coordinates) && 
        value.coordinates.length === 2 &&
        typeof value.coordinates[0] === 'number' &&
        typeof value.coordinates[1] === 'number') {
      return value;
    }
    throw new GraphQLError('Location must be a GeoJSON Point with type "Point" and coordinates array');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.OBJECT) {
      const value: any = {};
      ast.fields.forEach(field => {
        if (field.name.value === 'type' && field.value.kind === Kind.STRING) {
          value.type = field.value.value;
        }
        if (field.name.value === 'coordinates' && field.value.kind === Kind.LIST) {
          value.coordinates = field.value.values.map(coord => {
            if (coord.kind === Kind.FLOAT || coord.kind === Kind.INT) {
              return parseFloat(coord.value);
            }
            throw new GraphQLError('Coordinates must be numbers');
          });
        }
      });
      
      if (value.type === 'Point' && 
          Array.isArray(value.coordinates) && 
          value.coordinates.length === 2) {
        return value;
      }
    }
    throw new GraphQLError('Location must be a GeoJSON Point with type "Point" and coordinates array');
  },
});

// DateTime scalar from graphql-scalars package
import { DateTimeResolver } from 'graphql-scalars';

export const customScalars = {
  LocalizedText: LocalizedTextScalar,
  WindDirection: WindDirectionScalar,
  Location: LocationScalar,
  DateTime: DateTimeResolver,
};