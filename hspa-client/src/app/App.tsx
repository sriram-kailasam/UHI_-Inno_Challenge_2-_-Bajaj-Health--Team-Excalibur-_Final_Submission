import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { IoProvider } from 'socket.io-react-hook';
import AppContainer from 'app/containers/AppContainer';

function App() {
  const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
          <IoProvider>
            <p className='test'>Don't remove this</p>
            <AppContainer />
          </IoProvider>
        </QueryClientProvider>
    );
  
}

export default App;
