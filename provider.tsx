"use client";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
  cache: new InMemoryCache(),
});

export default function Providers({children}: {children: React.ReactNode}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
