import React, { useState } from "react";
import {
  Typography,
  Container,
  TextField,
  Button,
} from "@mui/material";
import { Autocomplete } from "@mui/lab";
import axios from "axios";

import AddEmployeeForm from '../components/AddEmployeeForm';
import EmployeeTable from "../components/EmployeeTable";

const EmployeeList = () => {
  const [searchName, setSearchName] = useState("");
  const [selectedNames, setSelectedNames] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [showForm, setShowForm] = useState(false);

  const names = [
    "Jessica",
    "Aksharika",
    "Charlie",
    "Ijoo",
    "David",
    "Eve",
    "Frank",
    "Grace",
    "Hank",
    "Ivy",
    "Jack",
  ];
  
  const emailMap = {
    Jessica: "tsaideep1998@gmail.com",
    Aksharika: "aksharikaraja@gmail.com",
    Charlie: "charlie@example.com",
    Ijoo: "ijooyoon.97@gmail.com",
    // Add the rest of the mappings here
  };

  const filteredNames = searchName
    ? names.filter((name) =>
        name.toLowerCase().includes(searchName.toLowerCase())
      )
    : [];


  const handleStartImmigration = (name) => {
    if (checkedItems[name]) {
      const email = emailMap[name];
      axios
        .post("http://localhost:5050/send-email", { name, email })
        .then((response) => {
          alert("Email sent successfully");
          console.log("Email sent:", response.data);
        })
        .catch((error) => {
          alert("There was an error sending the email!", error);
          console.error("There was an error sending the email!", error);
        });
    }
  };

  const handleSearch = (e) => {
    setSearchName(e.target.value);
  };

  const handleSelect = (event, value) => {
    if (value && !selectedNames.includes(value)) {
      setSelectedNames([...selectedNames, value]);
      setCheckedItems({ ...checkedItems, [value]: false });
    }
    setSearchName("");
  };

  const handleDelete = (name) => {
    setSelectedNames(selectedNames.filter((n) => n !== name));
    setCheckedItems((prevState) => {
      const newState = { ...prevState };
      delete newState[name];
      return newState;
    });
  };

  const handleCheckboxChange = (name) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  return (
    <Container
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h1"
        style={{
          color: "#3f51b5", // Attractive color
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontWeight: 700,
          fontSize: "3rem",
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        Welcome to Lawgical
      </Typography>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "16px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          style={{
            backgroundColor: "#3f51b5",
            color: "white",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            boxShadow: "0 3px 5px 2px rgba(63, 81, 181, .3)",
            textTransform: "none",
            marginRight: "16px",
          }}
          onClick={() => {
            setShowForm(true)
          }}
        >
          Add Employee
        </Button>
          <div style={{ width: "30%" }}>
            <Autocomplete
              freeSolo
              options={filteredNames}
              inputValue={searchName}
              onInputChange={(event, newInputValue) => {
                setSearchName(newInputValue);
              }}
              onChange={handleSelect}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search..."
                  onChange={handleSearch}
                  style={{ width: "100%" }}
                />
              )}
              style={{ width: "100%" }}
            />
          </div>
      </div>
      <AddEmployeeForm showForm={showForm} setShowForm={setShowForm} />
      <EmployeeTable />
    </Container>
  );
};

export default EmployeeList;