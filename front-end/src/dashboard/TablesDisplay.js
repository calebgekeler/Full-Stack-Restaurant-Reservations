import React from 'react';

export default function TablesDisplay({tables}){
  function occupiedLogic(table){
    return table.reservation_id === null;
  }
  let result = tables.map((table) =>(
    <div key={table.table_id} className="col-lg-6 p-3">
      <div className={occupiedLogic(table) ? "card bg-light" : "card bg-warning"}>
        <div className="card-body">
          <h5 id="data-table-id-status=${table.table_id}" className="card-title">{occupiedLogic(table) ? "Free" : "Occupied"}</h5>
          <p className="card-text">Table name: {table.table_name}</p>
          <p className="card-text">Table capacity: {table.capacity}</p>
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