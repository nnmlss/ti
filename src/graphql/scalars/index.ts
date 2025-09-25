import { GraphQLScalarType, GraphQLError } from 'graphql';
import { Kind } from 'graphql/language/kinds.js';
import type { WindDirection, LocalizedText, Location } from '@types';

// Your WindDirection enum values
const WIND_DIRECTIONS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
] as const;

export const LocalizedTextScalar = new GraphQLScalarType<LocalizedText, LocalizedText>({
  name: 'LocalizedText',
  description: 'Localized text with bg and en properties',
  serialize(value) {
    // Convert internal value to JSON for client
    if (value && typeof value === 'object' && ('bg' in value || 'en' in value)) {
      const result: LocalizedText = {};
      if ('bg' in value && typeof value.bg === 'string') {
        result.bg = value.bg;
      }
      if ('en' in value && typeof value.en === 'string') {
        result.en = value.en;
      }
      return result;
    }
    throw new GraphQLError('LocalizedText must be an object with bg and/or en properties');
  },
  parseValue(value) {
    // Convert input from client
    if (value && typeof value === 'object' && ('bg' in value || 'en' in value)) {
      const result: LocalizedText = {};
      if ('bg' in value && typeof value.bg === 'string') {
        result.bg = value.bg;
      }
      if ('en' in value && typeof value.en === 'string') {
        result.en = value.en;
      }
      return result;
    }
    throw new GraphQLError('LocalizedText must be an object with bg and/or en properties');
  },
  parseLiteral(ast) {
    // Parse literal value from query
    if (ast.kind === Kind.OBJECT) {
      const value: LocalizedText = {};
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

export const WindDirectionScalar = new GraphQLScalarType<WindDirection, WindDirection>({
  name: 'WindDirection',
  description: 'Wind direction enum (N, NE, E, SE, S, SW, W, NW, etc.)',
  serialize(value) {
    if (typeof value === 'string' && WIND_DIRECTIONS.includes(value as WindDirection)) {
      return value as WindDirection;
    }
    throw new GraphQLError(`WindDirection must be one of: ${WIND_DIRECTIONS.join(', ')}`);
  },
  parseValue(value) {
    if (typeof value === 'string') {
      for (const direction of WIND_DIRECTIONS) {
        if (value === direction) {
          return direction;
        }
      }
    }
    throw new GraphQLError(`WindDirection must be one of: ${WIND_DIRECTIONS.join(', ')}`);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const value = ast.value;
      for (const direction of WIND_DIRECTIONS) {
        if (value === direction) {
          return direction;
        }
      }
    }
    throw new GraphQLError(`WindDirection must be one of: ${WIND_DIRECTIONS.join(', ')}`);
  },
});

export const LocationScalar = new GraphQLScalarType<Location, Location>({
  name: 'Location',
  description: 'GeoJSON Point location with type and coordinates',
  serialize(value) {
    // Convert internal value (your Location type) to JSON for client
    if (value &&
        typeof value === 'object' &&
        'type' in value && value.type === 'Point' &&
        'coordinates' in value &&
        Array.isArray(value.coordinates) &&
        value.coordinates.length === 2 &&
        typeof value.coordinates[0] === 'number' &&
        typeof value.coordinates[1] === 'number') {
      return value as Location;
    }
    throw new GraphQLError('Location must be a GeoJSON Point with type "Point" and coordinates array');
  },
  parseValue(value) {
    // Convert input from client
    if (value &&
        typeof value === 'object' &&
        'type' in value && value.type === 'Point' &&
        'coordinates' in value &&
        Array.isArray(value.coordinates) &&
        value.coordinates.length === 2 &&
        typeof value.coordinates[0] === 'number' &&
        typeof value.coordinates[1] === 'number') {
      return value as Location;
    }
    throw new GraphQLError('Location must be a GeoJSON Point with type "Point" and coordinates array');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.OBJECT) {
      const value: Partial<Location> = {};
      ast.fields.forEach(field => {
        if (field.name.value === 'type' && field.value.kind === Kind.STRING && field.value.value === 'Point') {
          value.type = 'Point';
        }
        if (field.name.value === 'coordinates' && field.value.kind === Kind.LIST) {
          const coords = field.value.values.map(coord => {
            if (coord.kind === Kind.FLOAT || coord.kind === Kind.INT) {
              return parseFloat(coord.value);
            }
            throw new GraphQLError('Coordinates must be numbers');
          });
          if (coords.length === 2) {
            value.coordinates = [coords[0]!, coords[1]!];
          }
        }
      });
      
      if (value.type === 'Point' &&
          Array.isArray(value.coordinates) &&
          value.coordinates.length === 2 &&
          typeof value.coordinates[0] === 'number' &&
          typeof value.coordinates[1] === 'number') {
        return {
          type: 'Point',
          coordinates: [value.coordinates[0], value.coordinates[1]]
        };
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