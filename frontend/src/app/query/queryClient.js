// libs import
import { MutationCache, QueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(error.message || "Something went wrong"); 
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 min
    },
    mutations: {
      retry: false,
    },
  },
});
