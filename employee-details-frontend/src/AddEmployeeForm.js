import './AddEmployeeForm.css'

import { useState } from 'react';

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

  const handleSubmit = e => {
    e.preventDefault();

    // fetch request to add employeeInfo to DB here. 

    console.log('Add new employee:', employeeInfo)

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
