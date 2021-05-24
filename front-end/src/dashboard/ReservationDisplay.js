import React from 'react-router-dom';
import {cancelReservation} from '../utils/api';

function ReservationDisplay({loadDashboard, reservations}){
  
  function statusDisplay(status){
    if(status===null || status==="booked"){return "Booked"};
    if(status==="seated"){return "Seated"};
    if(status==="finished"){return "Finished"}
  }

  async function cancelRes(resId){
    const message = "Do you want to cancel this reservation? This cannot be undone."
    if(window.confirm(message)){
      const abortController = new AbortController();
      await cancelReservation(resId, abortController.signal);
      loadDashboard();
    }
  }

  const resCards = reservations.map((res) =>
    <div key={res.reservation_id} className="col-lg-6 p-3">
      <div className="card bg-light">
        <div className="card-body">
          <h5 data-reservation-id-status={res.reservation_id} className="card-title">Status: {statusDisplay(res.status)}</h5>
          <p className="card-text">Name on reservation: {`${res.first_name} ${res.last_name}`}</p>
          <p className="card-text">Mobile number: {res.mobile_number}</p>
          <p className="card-text">Time of reservation: {res.reservation_time}</p>
          <p className="card-text">Reservation ID: {res.reservation_id}</p>
          {res.status==="booked" ?
          <div className="row justify-content-around">
            <a href={`/reservations/${res.reservation_id}/seat`} className="btn btn-primary btn-sm">Seat</a>
            <a href={`/reservations/${res.reservation_id}/edit`} className="btn btn-secondary btn-sm">Edit</a>
            <button onClick={()=>cancelRes(res.reservation_id)} data-reservation-id-cancel={res.reservation_id} className="btn btn-danger btn-sm">Cancel</button>
          </div>
          : null }
        </div>
      </div>
    </div>
  );
  
  return(
    <div className="row">
      {resCards}
    </div>
  )
}

export default ReservationDisplay;