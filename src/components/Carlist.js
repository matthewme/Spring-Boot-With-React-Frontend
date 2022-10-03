import {SERVER_URL} from '../constants.js'
import React, {useEffect, useState} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';

// Function/Component to return list of cars
function Carlist(){
    //Create a state for the fetched cars
    const [cars,setCars] = useState([]);

    //Create a state for the delete message
    const [open,setOpen] = useState(false)

    //Execute fetch with the useEffect hook
    useEffect(()=>{
        fetchCars();
        fetch(SERVER_URL + 'api/cars/')
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
        .catch(err => console.log(err));
    },[]);

    const fetchCars = () => {
    fetch(SERVER_URL + 'api/cars/')
       .then(response => response.json())
       .then(data => setCars(data._embedded.cars))
       .catch(err => console.log(err));
    }

    const columns = [
        {field:'brand',headerName:'Brand',width:200},
        {field:'model',headerName:'Model',width:200},
        {field:'color',headerName:'Color',width:200},
        {field:'year',headerName:'Year',width:150},
        {field:'price',headerName:'Price',width:150},
        {
            field: '_links.self.href',
            headerName:'Delete',
            sortable: false,
            filterable: false,
            renderCell: row =>
                <button
                onClick={() => onDelClick(row.id)}>Delete
                </button>
        }
    ]

    const onDelClick = (url) => {
        fetch(url, {method:'DELETE'})
        .then(response => {
            fetchCars();
            setOpen(true);
        })
        .catch(err => console.log(err))
    }

    return(
        <div style={{height:500, width:'100%'}}>
            <DataGrid
                rows={cars}
                columns={columns}
                disableSelectionOnClick={true}
                getRowId={row => row._links.self.href}
            />
            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={()=> setOpen(false)}
                message="Car Deleted"
            />
        </div>
    );
}
export default Carlist;