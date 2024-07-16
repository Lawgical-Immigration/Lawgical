export default function AddEmployeeForm() {
  const employeeInfo = ['Last Name', 'First Name', 'DOB', 'email', 'Country'];
  const infoFields = [];

  for (const detail of employeeInfo) {
    const forAttribute = detail.toLowerCase().replace(' ', '-');

    infoFields.push(
      <>
        <label for={forAttribute}>{detail}</label>{' '}
        <input type='text' name={detail} required />
      </>
    );
  }
  return (
    <form action='submit'>
      {infoFields}
      <button>Submit</button>
    </form>
  );
}
