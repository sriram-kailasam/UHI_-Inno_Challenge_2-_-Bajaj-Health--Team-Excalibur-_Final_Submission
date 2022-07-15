import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppContainer from 'app/containers/AppContainer';

function App() {
  const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
          <AppContainer />
        </QueryClientProvider>
    );
  
}

export default App;
