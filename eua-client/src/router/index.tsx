import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./routes";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/eua">
                    {routes.map(({ isIndex, element, path }) => {
                        return (
                            <Route
                                key={path}
                                path={path}
                                index={isIndex}
                                element={element}
                            />
                        );
                    })}
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
