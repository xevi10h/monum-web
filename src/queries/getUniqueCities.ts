import { graphql } from '@/graphql';

export const getUniqueCities = graphql(`
  query getUniqueCities {
    uniqueCities
  }
`);
