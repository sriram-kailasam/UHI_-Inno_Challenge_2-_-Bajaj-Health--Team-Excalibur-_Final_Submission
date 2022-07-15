import { Outlet, useNavigate } from "react-router-dom"

const RouteHspaOutlet = () => {
  const navigate = useNavigate();
  const handleRedirectToLogin = () => {
    navigate('login');
  }
  return (
    <>
      <button onClick={handleRedirectToLogin}>Login</button>
      <Outlet />
    </>
  )
}

export default RouteHspaOutlet;