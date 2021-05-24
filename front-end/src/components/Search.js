import React, {useState} from 'react';
import {searchMobileNumber} from '../utils/api';
import ReservationDisplay from '../dashboard/ReservationDisplay';
import ErrorAlert from '../layout/ErrorAlert';

export default function Search(){
  const [reservations, setReservations] = useState([]);
  let [searchNum, setSearchNum] = useState("");
  let [noReservation, setNoReservation] = useState(false);
  let [errors, setErrors] = useState(null);

  const changeHandler = (e) =>{
    // if(!isNaN(e.target.value)){
    //   setSearchNum(e.target.value);
    // }
    // else{
    //   alert("Only numbers are allowed")
    // }
    setSearchNum(e.target.value);

  }

  const submitHandler = async (e) =>{
    e.preventDefault();
    const abortController = new AbortController();
    await searchMobileNumber(searchNum, abortController.signal)
      .then(reservationsArray =>{
        setReservations(reservationsArray)
        if(reservationsArray.length===0){
          setNoReservation(true);
        } else{
          setNoReservation(false);
        }
      })
      .catch(setErrors);
  }

  let searchInput = (
    <form onSubmit={submitHandler}>
      <div className="input-group mb-3">
        <input 
          name="mobile_number"
          type="text" 
          className="form-control" 
          placeholder="Enter a customer's phone number"
          value={searchNum}
          onChange={changeHandler}
        />
        <div className="input-group-append">
          <button onClick={()=>submitHandler} className="btn btn-outline-primary" type="submit">Find</button>
        </div>
      </div>
    </form>
  )

  const noResMessage = <h3>No reservations found</h3>

  return(
    <div className="row">
      <div className="col-md-6 pt-5">
        {searchInput}
        <ErrorAlert error={errors} />
      </div>
      <div className="col-md-6">
        <h2>Matching Reservations</h2>
        <ReservationDisplay reservations={reservations} />
        {noReservation ? noResMessage : null}

      </div>
    </div>
  )
}