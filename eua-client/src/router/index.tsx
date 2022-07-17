import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../components/login";
import ProtectedRoute from "./protected";
import { routes } from "./routes";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/eua/login" element={<Login />} />
                <Route path="/eua">
                    {routes.map(({ isIndex, element, path }) => {
                        return (
                            <Route
                                key={path}
                                path={path}
                                index={isIndex}
                                element={
                                    <ProtectedRoute>{element}</ProtectedRoute>
                                }
                            />
                        );
                    })}
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
