// // src/components/DetailedView.js
// import React, { useState } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button } from '@mui/material';
// import EmployeeSearch from './EmployeeList';

// const DetailedView = () => {
//     const [selectedEmployees, setSelectedEmployees] = useState([]);

//     const handleAddEmployee = (employee) => {
//         if (!selectedEmployees.some(e => e.id === employee.id)) {
//             setSelectedEmployees((prevSelected) => [...prevSelected, employee]);
//         }
//     };

//     const handleDeleteEmployee = (employeeId) => {
//         setSelectedEmployees((prevSelected) => prevSelected.filter(employee => employee.id !== employeeId));
//     };

//     return (
//         <div>
//             <h1>Search Employees</h1>
//             <EmployeeSearch onAddEmployee={handleAddEmployee} />
//             <h1>Selected Employees</h1>
//             <TableContainer component={Paper}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>Checkbox</TableCell>
//                             <TableCell>Name</TableCell>
//                             <TableCell>Email</TableCell>
//                             <TableCell>Actions</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {selectedEmployees.map((employee, index) => (
//                             <TableRow key={employee.id}>
//                                 <TableCell>
//                                     <Checkbox />
//                                 </TableCell>
//                                 <TableCell>{employee.first_name} {employee.last_name}</TableCell>
//                                 <TableCell>{employee.email}</TableCell>
//                                 <TableCell>
//                                     <Button
//                                         variant="contained"
//                                         color="secondary"
//                                         onClick={() => alert(`Starting immigration process for ${employee.first_name} ${employee.last_name}`)}
//                                     >
//                                         Start Immigration Process
//                                     </Button>
//                                     <Button
//                                         variant="contained"
//                                         color="error"
//                                         onClick={() => handleDeleteEmployee(employee.id)}
//                                         style={{ marginLeft: '10px' }}
//                                     >
//                                         Delete
//                                     </Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </div>
//     );
// };

// export default DetailedView;
