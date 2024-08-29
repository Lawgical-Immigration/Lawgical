import '../css/AddEmployeeForm.css'

import { useState } from 'react';
import axios from 'axios';

export default function AddEmployeeForm({showForm, setShowForm}) {

  const [employeeInfo, setEmployeeInfo] = useState({
    'firstName': '',
    'lastName': '',
    'DOB': '',
    'email': '',
    'country': ''
  })

  const infoFields = [];

  const handleChange = e => {
    let {name, value} = e.target;
    e.preventDefault();

    setEmployeeInfo((prevEmployeeInfo) => ({
      ...prevEmployeeInfo, [name]: value
    }))
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const addNewEmployee = await axios.post('http://localhost:5050/employee', employeeInfo, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        }})
      
      alert(addNewEmployee.data);
      
      setEmployeeInfo(prevState => ({
        ...prevState,
        'firstName': '',
        'lastName': '',
        'DOB': '',
        'email': '',
        'country': ''
      }))
        
        setShowForm(false);
    } catch (error) {
      console.error('Error: ', error)
      alert(`Error adding employee.`)
    }
  }

  for (const detail in employeeInfo) {

    const inputLame = (() => {
      if(detail === 'firstName') return 'First Name';
      if(detail === 'lastName') return 'Last Name';
      else return detail[0].toUpperCase() + detail.slice(1);
    })();

    const inputType = detail === 'DOB' ? 'date' : 'text';

    infoFields.push(
      <>
        <label htmlFor={detail}>{inputLame}</label>
        <input name={detail} type={inputType} value={employeeInfo[detail]} onChange={handleChange} required />
      </>
    )
  };

  return (showForm) ? (
    <div className="popup">
    <form id='add-employee-form' action='submit' onSubmit={handleSubmit}>
      {infoFields}
      <div id='add-employee-buttons'>
        <button id="add">Submit</button>
        <button id="cancel" onClick={() => setShowForm(false)}>Cancel</button>
      </div>
    </form>
    </div>
  ) : "";
}
