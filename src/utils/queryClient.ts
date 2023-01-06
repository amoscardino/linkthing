import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: 60 * 60 * 1000, // 60 minutes
            cacheTime: 60 * 60 * 1000, // 60 minutes
        }
    }
});

export default queryClient;
