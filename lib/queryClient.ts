import { QueryClient } from '@tanstack/react-query';

/** App-weiter React-Query-Client. Konservative Defaults für mobile Netze. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 Min frisch
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
