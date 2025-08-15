#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'dist/graphql/scalars/index.js';
try {
  let content = readFileSync(filePath, 'utf-8');
  content = content.replace("from '../../graphql'", "from 'graphql'");
  writeFileSync(filePath, content);
  console.log('Fixed GraphQL import in', filePath);
} catch (error) {
  console.warn('Could not fix GraphQL import:', error.message);
}