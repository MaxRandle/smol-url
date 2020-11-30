import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import HomePage from "./HomePage";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/error" exact>
          <ErrorPage />
        </Route>
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
