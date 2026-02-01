import React, { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo';

interface GraphQLProviderProps {
  children: ReactNode;
}

export const GraphQLProvider: React.FC<GraphQLProviderProps> = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
};

export default GraphQLProvider;
