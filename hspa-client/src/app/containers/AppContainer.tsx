import { BrowserRouter } from "react-router-dom";
import Routes from "../routes/AppRoutes";

const AppContainer = () => {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  )
}

export default AppContainer;