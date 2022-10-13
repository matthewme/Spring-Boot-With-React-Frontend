import {SERVER_URL} from '../constants.js'
import React, {useEffect, useState} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import AddCar from './AddCar.js';
import EditCar from './EditCar.js';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

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
            field:'_links.car.href',
            headerName: 'Edit',
            sortable: false,
            filterable: false,
            renderCell: row =>
                <EditCar
                    data={row}
                    updateCar={updateCar}/>
        },
        {
            field: '_links.self.href',
            headerName:'Delete',
            sortable: false,
            filterable: false,
            renderCell: row =>
                <IconButton onClick={() => onDelClick(row.id)}><DeleteIcon color='error' /></IconButton>
        }
    ]

    const onDelClick = (url) => {
        if(window.confirm('Are you sure you want to delete?')){
            fetch(url, {method:'DELETE'})
            .then(response => {
                 if(response.ok){
                    fetchCars();
                    setOpen(true);
                 }else{alert("Something went wrong!")}
            })
            .catch(err => console.log(err))
       }
    }

    // Add a new car
    const addCar = (car) => {
        fetch(SERVER_URL + 'api/cars',
        {
        method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(car)
        })
        .then(response => {if(response.ok){fetchCars();}else{alert('Can\'t Save the new car!')}})
        .catch(err => console.log(err))
    }

    // Update Car
    const updateCar = (car, link) => {
        fetch(link,
        {
        method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(car)
        })
        .then(response => {if(response.ok){fetchCars();}else{alert('Can\'t update the car!')}})
        .catch(err => console.log(err))
    }

    return(
    <React.Fragment>
        <Stack mt={2} mb={2}>
            <AddCar addCar={addCar} />
        </Stack>
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
        </React.Fragment>
    );
}
export default Carlist;