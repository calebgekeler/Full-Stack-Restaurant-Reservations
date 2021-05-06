import React, { useEffect, useState } from "react";
import {useLocation} from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationDisplay from "./ReservationDisplay";
import {previous, next, today} from "../utils/date-time";


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ defaultDate }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  let query = new URLSearchParams(useLocation().search);

  const queryDate = query.get("date");
  
  let [date, setDate] = useState(queryDate ? queryDate : defaultDate)

  const buttons = (
    <div className="row p-3 justify-content-around">
      <button onClick={()=> setDate(previous(date))} name="previous" className="btn btn-outline-primary btn-lg">Previous Day</button>
      <button 
        onClick={()=> setDate(today())} 
        name="today" 
        className={defaultDate===date ? "btn btn-success btn-lg" : "btn btn-outline-success btn-lg"}>Today</button>
      <button onClick={() => setDate(next(date))} name="next" className="btn btn-outline-primary btn-lg">Next Day</button>
    </div>
  )
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations( {date}, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {buttons}
      <section className="col col-md-6">
        <ReservationDisplay reservations={reservations}/>
      </section>
    </main>
  );
}

export default Dashboard;
