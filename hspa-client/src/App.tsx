import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hello } from './hello';
import { trpc } from './utils/trpc';

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: '/trpc',
    }),
  );

 
    return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <p>Hello</p>
          <Hello></Hello>
        </QueryClientProvider>
      </trpc.Provider>
    );
  
}

export default App;
