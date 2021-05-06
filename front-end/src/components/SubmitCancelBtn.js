import React from "react";

export default function SubmitCancelBtn({validation, submitHandler, cancelHandler}){
  return(
    <div className="row pl-3 pr-3 justify-content-around">
      <button type="submit" disabled={!validation()} className="btn btn-success" onClick={submitHandler}>Submit</button>
      <button type="cancel" className="btn btn-danger" onClick={cancelHandler}>Cancel</button>
    </div>
  )
}