import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewResForm from "../components/NewResForm";
import NewTableForm from "../components/NewTableForm";
import SeatReservation from "../components/SeatReservation";
import Search from "../components/Search";
import EditResForm from "../components/EditResForm";
import Login from "../dashboard/Login";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route path="/login" exact>
        <Login />
      </Route>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard defaultDate={today()} />
      </Route>
      <Route path="/reservations/new" exact>
        <NewResForm defaultDate = {today()}/>
      </Route>
      <Route path="/tables/new">
        <NewTableForm />
      </Route>
      <Route path="/reservations/:reservations_id/seat" exact>
        <SeatReservation />
      </Route>
      <Route path="/search" exact>
        <Search />
      </Route>
      <Route path="/reservations/:reservations_id/edit" exact>
        <EditResForm />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
