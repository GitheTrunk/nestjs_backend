import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client/core'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_HASURA_HTTP,
  headers: {
    'x-hasura-role': import.meta.env.VITE_HASURA_ROLE,
  },
})

// Optional (for subscriptions)
const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_HASURA_WS,
    connectionParams: async () => ({
      headers: {
        'x-hasura-role': import.meta.env.VITE_HASURA_ROLE,
      },
    }),
  }),
)

const link = split(
  ({ query }) => {
    const def = getMainDefinition(query)
    return def.kind === 'OperationDefinition' && def.operation === 'subscription'
  },
  wsLink,
  httpLink,
)

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
