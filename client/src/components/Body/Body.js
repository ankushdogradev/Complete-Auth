import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginRegisterScreen from "../../screens/LoginRegisterScreen/LoginRegisterScreen";
import ForgotPaswordScreen from "../../screens/ForgotPasswordScreen/ForgotPasswordScreen";
import ResetPasswordScreen from "../../screens/ResetPasswordScreen/ResetPasswordScreen";
import ProtectedRoutes from "../Protect/ProtectedRoutes";
import PrivateScreen from "../../screens/PrivateScreen/PrivateScreen";

const Body = () => {
  return (
    <Router>
      <Switch>
        <ProtectedRoutes exact path="/" component={PrivateScreen} />
        <Route exact path="/loginRegister" component={LoginRegisterScreen} />
        <Route exact path="/forgotPasword" component={ForgotPaswordScreen} />
        <Route
          exact
          path="/resetPassword/:token"
          component={ResetPasswordScreen}
        />
      </Switch>
    </Router>
  );
};

export default Body;
