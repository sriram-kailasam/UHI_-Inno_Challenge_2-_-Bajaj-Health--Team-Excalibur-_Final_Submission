import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { IoProvider } from "socket.io-react-hook";
import { store } from "../redux/store";
import AppRouter from "../router";

const queryClient = new QueryClient();

function AppInit() {
  return (
    <IoProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AppRouter />
        </QueryClientProvider>
      </Provider>
    </IoProvider>
  );
}

export default AppInit;
