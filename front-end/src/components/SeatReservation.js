import React, {useState, useEffect} from 'react';
import {useParams, useHistory} from "react-router-dom";
import {readReservation, listTables, seatResToTable} from "../utils/api";
import SeatReservationForm from "./SeatRervationForm";
import SubmitCancelBtn from "./SubmitCancelBtn";

export default function SeatReservation(){
  const history = useHistory();
  const {reservations_id} = useParams();

  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);
  const [table, setTable] = useState({});
  const [idToPut, setIdToPut] = useState("");

  useEffect(()=>{
    const abortController = new AbortController();
    async function loadPage(id){
      await readReservation(id, abortController.signal)
        .then(setReservation)
        .catch(/* error catcher */);
      await listTables(abortController.signal)
        .then(setTables);
      return
    }
    loadPage(reservations_id); 
  }, [reservations_id]);

  const cancelHandler = () =>{
    history.goBack();
  }
  
  function validation(){
    return reservation.people <= table.capacity;
  }

  const submitHander = async (e) =>{
    e.preventDefault();
    const abortController = new AbortController();
    await seatResToTable(reservations_id, table.table_id, abortController.signal);
    history.push("/dashboard");
  }

  

  const resCard = (
      <div className="card bg-light">
        <div className="card-body">
          <h5 className="card-title">{reservation.last_name}, {reservation.first_name}</h5>
          <p className="card-text">Mobile number:</p>
          <p className="card-text">{reservation.mobile_number}</p>
          <p className="card-text">Time of reservation:</p>
          <p className="card-text">{reservation.reservation_time}</p>
          <p className="card-text">Number of people for reservation:</p>
          <p className="card-text">{reservation.people}</p>
          <p className="card-text">Reservation ID: {reservation.reservation_id}</p>
        </div>
      </div>
  )
  
  return(
    <section className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-10">
          <SeatReservationForm 
            setTable={setTable} 
            tables={tables} 
            idToPut={idToPut} 
            setIdToPut={setIdToPut}/>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 col-10">
          <h3>Seat reservation: </h3>
          {resCard}
        </div>
      </div>
      <div className="pt-3">
        <SubmitCancelBtn validation={validation} submitHandler={submitHander} cancelHandler={cancelHandler}/>
      </div>
    </section>
  )
}