import React from 'react-router-dom';
import {Link} from 'react-router-dom';
import {cancelReservation} from '../utils/api';
import * as Icon from 'react-bootstrap-icons';
import {resTimeFormat} from '../utils/date-time';

function ReservationDisplay({refresh, reservations}){
  
  function statusDisplay(status){
    if(status===null || status==="booked"){return "Booked"};
    if(status==="seated"){return "Seated"};
    if(status==="finished"){return "Finished"};
    if(status==="cancelled"){return "Cancelled"}
  }

  async function cancelRes(resId){
    const message = "Do you want to cancel this reservation? This cannot be undone."
    if(window.confirm(message)){
      const abortController = new AbortController();
      await cancelReservation(resId, abortController.signal);
      await refresh();
    }
  }

  function btnDisabled(status){
    return status!=="booked"
  }

  function cardBorder(status){
    if(status==="booked"){
      return `border-primary`
    }
    if(status==="seated"){
      return `border-success`
    }
    if(status==="cancelled"){
      return `border-danger`
    }
    if(status==="finished"){
      return `border-warning`
    }
  }

  const resCards = reservations.map((res) =>
    <div key={res.reservation_id} className="col-lg-6 p-3">
      <div className={`card ${cardBorder(res.status)} bg-light`}>
        <div className="card-body">
          <h5 data-reservation-id-status={res.reservation_id} className="card-title">{statusDisplay(res.status)}</h5>
          <Icon.Person size={20}/>
          <p className="card-text">{`${res.first_name} ${res.last_name}`}</p>
          <Icon.Telephone size={20}/>
          <p className="card-text">{res.mobile_number}</p>
          <Icon.Clock size={20}/>
          <p className="card-text">{resTimeFormat(res.reservation_time)}</p>
          <Icon.CalendarCheck size={20} />
          <p className="card-text">{res.reservation_date}</p>
          <p className="card-text">Reservation ID: {res.reservation_id}</p>
          <div className="row justify-content-around">
            <Link to={`/reservations/${res.reservation_id}/seat`}><button className="btn btn-primary btn-sm" disabled={btnDisabled(res.status)}><Icon.PersonCheck size={20} /></button></Link>
            <Link to={`/reservations/${res.reservation_id}/edit`}><button className="btn btn-secondary btn-sm" disabled={btnDisabled(res.status)}><Icon.Pencil size={20}/></button></Link>
            <button disabled={btnDisabled(res.status)} onClick={()=>cancelRes(res.reservation_id)} data-reservation-id-cancel={res.reservation_id} className="btn btn-danger btn-sm"><Icon.XCircle size={20}/></button>
          </div>
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