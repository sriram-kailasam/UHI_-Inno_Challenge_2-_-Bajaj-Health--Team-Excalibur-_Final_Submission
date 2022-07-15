import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

function App() {
  const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
          <p>Hello</p>
        </QueryClientProvider>
    );
  
}

export default App;
