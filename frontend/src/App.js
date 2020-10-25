/* eslint-disable no-unused-vars */
import React, { useState, Fragment, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import setAuthToken from "./reduxstuff/utils/setAuthToken";
import store from "./reduxstuff/store";
import { loadUser } from "./reduxstuff/actions/auth";

const App = () => {
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      store.dispatch(loadUser());
    }
  }, []);

  return (
    <Router>
      <Fragment>
        {/* <Navbar /> */}
        {/* <Route exact path="/" component={Landing} /> */}
        <section className="container">
          {/* <Alert /> */}
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Register} />
            {/* <Route exact path="/profile/:id" component={Profile} /> */}
            {/* <PrivateRoute exact path="/dashboard" component={Dashboard} /> */}
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
};

export default App;
