import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";
import { Autocomplete } from "@mui/lab";
import { Check } from "@mui/icons-material";


export default function EmployeeTable(){
  const [employeeData, setEmployeeData] = useState([]);
  
  const tableCellList = ['Select', 'Status','Last Name', 'First Name', 'Date of Birth', 'Email', 'Country', 'Actions'];
  const tableCells = tableCellList.map(el => <TableCell>{el}</TableCell>);
  const employees = [];

  useEffect(() => {
    axios.get('http://localhost:5050/employee')
    .then(res => {
      setEmployeeData(res.data);
    })
    .catch(err => console.error(`Error retrieving employees. ERR: ${err}`))
  }, []);
  

  for (const employee of employeeData) {

    const rowFieldsList = ['status', 'lastName', 'firstName', 'DOB', 'email', 'country'];
    
    const rowFields = rowFieldsList.map(el => <TableCell>{employee[el]}</TableCell>);
    
    employees.push(
      <TableRow>
        <TableCell><Checkbox /></TableCell>
        {rowFields}
        <TableCell>
          <Button>Start Immigration</Button>
          <Button>Delete</Button>
        </TableCell>
      </TableRow>
    )
  };

  return(
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>{tableCells}</TableRow>
        </TableHead>
        {employees}
      </Table>
    </TableContainer>
  )
}