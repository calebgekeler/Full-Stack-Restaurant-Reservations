import React from 'react';
import {unassignTable} from "../utils/api";

export default function TablesDisplay({tables, loadDashboard}){
  function occupiedLogic(table){
    return table.reservation_id === null;
  }


  async function unseatTable(table){
    const abortController = new AbortController();
    const message = `Is this table ready to seat new guests? This cannot be undone.`
    if(window.confirm(message)){
      await unassignTable(table.table_id, abortController.signal);
      loadDashboard();
    }
  }

  let result = tables.map((table) =>(
    <div key={table.table_id} className="col-lg-6 p-3">
      <div className={occupiedLogic(table) ? "card bg-light" : "card bg-warning"}>
        <div className="card-body">
          <h5 data-table-id-status={table.table_id} className="card-title">{occupiedLogic(table) ? "Free" : "Occupied"}</h5>
          <p className="card-text">Table name: {table.table_name}</p>
          <p className="card-text">Table capacity: {table.capacity}</p>
          <p className="card-text">Reservation ID: {table.reservation_id}</p>
          <button onClick={()=>unseatTable(table)} data-table-id-finish={table.table_id} className="btn btn-danger btn-sm" disabled={occupiedLogic(table)}>Finish</button>
        </div>
      </div>
    </div>
  ));
  
  return(
    <div className="row">
      {result}
    </div>
  );
}