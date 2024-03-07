'use client';

import { fetchExchange, useMutation, useQuery } from 'urql';
import { ResultOf, VariablesOf, graphql } from '@/graphql';

import { createClient, Provider } from 'urql';
import { Button } from '@/app/ui/button';

const graphqlClient = createClient({
  url: 'http://localhost:4000/graphql',
  exchanges: [fetchExchange], // Add the exchanges property here
});

export default function GraphPage() {
  return (
    <Provider value={graphqlClient}>
      <div>
        <h1>Graph</h1>
        <LoginComponent />
      </div>
    </Provider>
  );
}

function LoginComponent() {
  const LoginMutation = graphql(`
    mutation Mutation($loginInput: LoginInput!) {
      loginUser(loginInput: $loginInput) {
        id
        email
        username
        isTemporalPassword
        createdAt
        googleId
        token
        language
        name
        photo
        hasPassword
      }
    }
  `);

  const variables: VariablesOf<typeof LoginMutation> = {
    loginInput: {
      emailOrUsername: 'pau.vilella.st+monum@gmail.com',
      password: 'Monum123.,',
    },
  };
  const [updateTodoResult, loginMutation] = useMutation(LoginMutation);

  const handleLogin = async () => {
    const result = await loginMutation(variables);
    console.log(result.data); // Access the data returned by the mutation
  };
  return (
    <div>
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
}
