import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Button, Input } from "@mui/material";

const UploadPage = () => {
  const { id } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);

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
        // setSelectedFile(null); // Clear the file input
        // document.getElementById('fileInput').value = '';
      } else {
        // const errorMsg = await response.text();
        alert("File upload failed:");
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
    </Container>
  );
};

export default UploadPage;
