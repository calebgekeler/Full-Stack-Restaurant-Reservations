import React, {useState} from 'react';
import {searchMobileNumber} from '../utils/api';
import ReservationDisplay from '../dashboard/ReservationDisplay';
import ErrorAlert from '../layout/ErrorAlert';

export default function Search(){
  const [reservations, setReservations] = useState([]);
  let [searchNum, setSearchNum] = useState("");
  let [noReservation, setNoReservation] = useState(false);
  let [errors, setErrors] = useState(null);
  const abortController = new AbortController();

  const changeHandler = (e) =>{
    setSearchNum(e.target.value);
  }

  async function loadResults(){
    return await searchMobileNumber(searchNum, abortController.signal)
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

  const submitHandler = async (e) =>{
    e.preventDefault();
    loadResults();
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

  const noResMessage = <h3 className="alert alert-danger">No reservations found</h3>

  return(
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-9 pt-5">
          {searchInput}
          <ErrorAlert error={errors} />
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-9 col-12">
          <ReservationDisplay refresh={loadResults} reservations={reservations} />
          {noReservation ? noResMessage : null}
        </div>
      </div>
    </div>
  )
}