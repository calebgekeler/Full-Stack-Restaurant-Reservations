import React, {useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import ReservationForm from './ReservationForm';
import {readReservation} from '../utils/api';
import SubmitCancelBtn from './SubmitCancelBtn'
import {updateReservation} from '../utils/api';

export default function EditFormForm(){
  let [reservation, setReservation] = useState({});
  const {reservations_id} = useParams();
  let history=useHistory();

  useEffect(()=>{
    async function readRes(id){
      const abortController = new AbortController();
      await readReservation(id, abortController.signal)
        .then(setReservation)
        // add catch errors
    }
    readRes(reservations_id);
  },[reservations_id])
  const newDate = new Date(`${reservation.reservation_date} ${reservation.reservation_time}`);

  const changeHandler = (e) =>{
    if(e.target.name==="people"){
      setReservation({
        ...reservation,
        [e.target.name]: e.target.valueAsNumber
      })
    } else{
      setReservation({
        ...reservation,
        [e.target.name]: e.target.value
      });
    }
  };  

  const cancelHandler=()=>{
    history.goBack();
  }

  const validation=()=>{
    return true
  }

  const submitHandler=async (e)=>{
    e.preventDefault();
    const abortController=new AbortController();
    console.log("RESERVATION BEFORE PUT", reservation);
    await updateReservation(reservation, abortController.signal);
    history.push(`/dashboard?date=${reservation.reservation_date}`);
    // TODO: after history push, rerender maybe use hooks
  }

  return(
    <section>
      <h2>Edit Reservation</h2>
      <ReservationForm 
        resForm={reservation}
        dateObj={newDate}
        changeHandler={changeHandler}
      />
      <SubmitCancelBtn 
        cancelHandler={cancelHandler}
        validation={validation}
        submitHandler={submitHandler}
      />
    </section>
  )
}