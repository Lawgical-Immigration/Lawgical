import './AddEmployeeForm.css'

export default function AddEmployeeForm({showForm, setShowForm}) {
  const employeeInfo = ['Last Name', 'First Name', 'DOB', 'email', 'Country'];
  const infoFields = [];

  for (const detail of employeeInfo) {
    const attributeName = detail.toLowerCase().replace(' ', '-');

    infoFields.push(
      <>
        <label htmlFor={attributeName}>{detail}</label>{' '}
        <input className='add-employee-input' type='text' id={attributeName} required />
      </>
    )
  };

  return (showForm) ? (
    <div className="popup">
    <form id='add-employee-form' action='submit'>
      {infoFields}
      <div id='add-employee-buttons'>
        <button id="add">Submit</button>
        <button id="cancel" onClick={() => setShowForm(false)}>Cancel</button>
      </div>
    </form>
    </div>
  ) : "";
}
