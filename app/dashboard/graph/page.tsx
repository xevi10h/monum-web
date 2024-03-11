'use client';

import { useQuery } from '@apollo/client';
import { graphql } from '@/graphql';
import { requireAuth } from '@/atuh';

function GraphPage() {
  return (
      <div>
        <h1>Graph</h1>
        <LoginComponent />
      </div>
  );
}

function LoginComponent() {
  const getUser = graphql(`
    query Query {
      user {
        email
        username
      }
    }
  `);
  const { loading, error, data } = useQuery(getUser);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      <h2>Usuari</h2>
      {
        !data?.user ? "No hi ha cap usuari loguejat." :
        <div>
          <p>Email: {data.user.email}</p>
          <p>Username: {data.user.username}</p>
        </div>
      }
    </div>
  );
}

export default requireAuth(GraphPage);
