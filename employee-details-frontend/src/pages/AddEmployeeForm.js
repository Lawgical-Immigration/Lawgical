import { useState } from 'react';

export default function AddEmployeeForm({ showForm, setShowForm }) {
  const [employeeInfo, setEmployeeInfo] = useState({
    firstName: '',
    lastName: '',
    DOB: '',
    email: '',
    country: '',
  });

  const infoFields = [];

  const handleChange = (e) => {
    let { name, value } = e.target;
    e.preventDefault();

    setEmployeeInfo((prevEmployeeInfo) => ({
      ...prevEmployeeInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const addNewEmployee = await fetch('http://localhost:5050/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeInfo),
      });

      const response = await addNewEmployee.json();
      alert(response);

      setEmployeeInfo({
        firstName: '',
        lastName: '',
        DOB: '',
        email: '',
        country: '',
      });

      setShowForm(false);
    } catch (error) {
      console.log(error);
      alert('Error adding employee. Please try again.');
    }
  };

  for (const detail in employeeInfo) {
    const inputLame = (() => {
      if (detail === 'firstName') return 'First Name';
      if (detail === 'lastName') return 'Last Name';
      else return detail[0].toUpperCase() + detail.slice(1);
    })();

    const inputType = detail === 'DOB' ? 'date' : 'text';

    infoFields.push(
      <div className="mb-4 w-full" key={detail}>
        <label htmlFor={detail} className="block text-gray-700 font-bold mb-2">
          {inputLame}
        </label>
        <input
          name={detail}
          type={inputType}
          value={employeeInfo[detail]}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }

  return showForm ? (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-20 flex justify-center items-center">
      <form
        id="add-employee-form"
        className="relative p-8 w-3/5 bg-white flex flex-col"
        onSubmit={handleSubmit}
      >
        {infoFields}
        <div className="pt-2 flex justify-evenly">
          <button
            id="add"
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
          <button
            id="cancel"
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  ) : (
    ''
  );
}
