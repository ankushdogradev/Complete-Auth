import { Route, Redirect } from "react-router-dom";
import Auth from "./Auth";

const ProtectedRoutes = ({ component: Component, ...rest }) => {
  console.log("🔐", Auth.isAuthenticated());

  return (
    <Route
      {...rest}
      render={(props) =>
        Auth.isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/loginRegister" />
        )
      }
    />
  );
};

export default ProtectedRoutes;
