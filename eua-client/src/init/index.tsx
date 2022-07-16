import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import AppRouter from "../router";

function AppInit() {
    return (
        <Provider store={store}>
            <AppRouter />
        </Provider>
    );
}

export default AppInit;
