import { 
  useQuery, 
  useMutation, 
  QueryHookOptions, 
  MutationHookOptions,
  MutationTuple 
} from '@apollo/client';
import { 
  GET_WALLETS, 
  GET_WALLET, 
  CREATE_WALLET, 
  UPDATE_WALLET, 
  DELETE_WALLET 
} from '../graphql/operations';
import { 
  Wallet, 
  CreateWalletInput, 
  UpdateWalletInput,
  ID 
} from '../types/graphql';

// Query hooks
export const useWallets = (options?: QueryHookOptions) => {
  return useQuery<{ wallets: Wallet[] }>(GET_WALLETS, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    ...options,
  });
};

export const useWallet = (id: ID, options?: QueryHookOptions) => {
  return useQuery<{ wallet: Wallet }>(GET_WALLET, {
    variables: { id },
    errorPolicy: 'all',
    skip: !id,
    ...options,
  });
};

// Mutation hooks
export const useCreateWallet = (
  options?: MutationHookOptions<{ createWallet: Wallet }, { input: CreateWalletInput }>
): MutationTuple<{ createWallet: Wallet }, { input: CreateWalletInput }> => {
  return useMutation(CREATE_WALLET, {
    errorPolicy: 'all',
    update: (cache, { data }) => {
      if (data?.createWallet) {
        // Update the wallets cache
        const existing = cache.readQuery<{ wallets: Wallet[] }>({ 
          query: GET_WALLETS 
        });
        
        if (existing) {
          cache.writeQuery({
            query: GET_WALLETS,
            data: {
              wallets: [...existing.wallets, data.createWallet]
            }
          });
        }
      }
    },
    ...options,
  });
};

export const useUpdateWallet = (
  options?: MutationHookOptions<{ updateWallet: Wallet }, { id: ID; input: UpdateWalletInput }>
): MutationTuple<{ updateWallet: Wallet }, { id: ID; input: UpdateWalletInput }> => {
  return useMutation(UPDATE_WALLET, {
    errorPolicy: 'all',
    ...options,
  });
};

export const useDeleteWallet = (
  options?: MutationHookOptions<{ deleteWallet: boolean }, { id: ID }>
): MutationTuple<{ deleteWallet: boolean }, { id: ID }> => {
  return useMutation(DELETE_WALLET, {
    errorPolicy: 'all',
    update: (cache, { data }, { variables }) => {
      if (data?.deleteWallet && variables?.id) {
        // Remove from wallets cache
        const existing = cache.readQuery<{ wallets: Wallet[] }>({ 
          query: GET_WALLETS 
        });
        
        if (existing) {
          cache.writeQuery({
            query: GET_WALLETS,
            data: {
              wallets: existing.wallets.filter(wallet => wallet.id !== variables.id)
            }
          });
        }
        
        // Remove wallet detail from cache
        cache.evict({ 
          id: `Wallet:${variables.id}` 
        });
      }
    },
    ...options,
  });
};
