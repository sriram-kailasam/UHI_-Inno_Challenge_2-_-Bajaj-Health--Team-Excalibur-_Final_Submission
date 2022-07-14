import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hello } from './hello';
import { trpc } from './utils/trpc';

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: 'http://localhost:5000/trpc',
    }),
  );

 
    return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Hello></Hello>
        </QueryClientProvider>
      </trpc.Provider>
    );
  
}

export default App;
