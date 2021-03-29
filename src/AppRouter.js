import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import React from "react";
import { AnimatePresence } from "framer-motion";
import App from "./App";
import { Page } from "./Page";

const AppRouter = () => {
  return (
    <Router>
      <Route
        render={({ location }) => (
          <AnimatePresence exitBeforeEnter initial={false}>
            <Switch location={location} key={location.pathname}>
              <Route exact path="/page" component={Page} />
              <Route exact path="/" component={App} />
            </Switch>
          </AnimatePresence>
        )}
      />
    </Router>
  );
};

export default AppRouter;
