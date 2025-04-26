'use client';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  // localhost: 'http://localhost:4000/graphql'
  // production: 'process.env.NEXT_PUBLIC_GRAPHQL_API_URL'
});

const authLink = setContext((_, { headers }) => {
  const userLocalStorage = localStorage.getItem('user');
  const state = userLocalStorage ? JSON.parse(userLocalStorage).state : null;
  const user = state ? state.user : null;
  const token = user ? user.token : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
