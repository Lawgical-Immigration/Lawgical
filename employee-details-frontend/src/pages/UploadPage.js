import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Button, Input } from "@mui/material";
import ChatInterface from "./chatInterface";

const UploadPage = () => {
  const { id } = useParams();
  const [userID, setUserID] = useState(null);
  const [userName, setUserName] = useState(null);
  
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const user = await response.json();
        if (!user) console.log("UPLOADPAGE User not found for id: ", id);
        else {
          console.log("user found in uploadpage: ", user);
          setUserID(user._id);
          setUserName(user.name);
        }
      } catch (err) {
        console.log("error while retrieving user/conversation from userModel")
        console.log("id: ", id);
        console.log("error: ", err);
      }
    };
    fetchData();
  },[id])

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("id", id); // Pass the unique ID

    try {
      const response = await fetch(`http://localhost:5050/upload/${id}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        alert("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed!");
    }
  };

  return (
    <Container
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "16px",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div style={{ flex: 1, marginRight: "16px" }}>
        <Typography
          variant="h2"
          style={{
            color: "#3f51b5",
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 700,
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          Upload Documents
        </Typography>
        <Input
          id="fileinput"
          type="file"
          onChange={handleFileChange}
          style={{
            marginBottom: "16px",
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          style={{
            backgroundColor: "#3f51b5",
            color: "white",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            boxShadow: "0 3px 5px 2px rgba(63, 81, 181, .3)",
            textTransform: "none",
          }}
        >
          Upload
        </Button>
      </div>
      <div style={{ flex: 1 }}>
        {userID && userName ? (
          <ChatInterface userID={userID} userName={userName}/>
        ) : (
          <Typography variant="h6" style={{ textAlign: "center" }}>
            Loading...
          </Typography>
        )}
      </div>
    </Container>
  );
};

export default UploadPage;
