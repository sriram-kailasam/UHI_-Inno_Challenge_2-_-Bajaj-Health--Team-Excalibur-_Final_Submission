import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import AppRouter from "../router";

const queryClient = new QueryClient();

function AppInit() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <AppRouter />
            </QueryClientProvider>
        </Provider>
    );
}

export default AppInit;
