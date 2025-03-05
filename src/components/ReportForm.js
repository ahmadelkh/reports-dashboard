import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Button, TextField, Box, Paper } from "@mui/material";
import axios from "axios"; // ✅ Import Axios for Cloudinary uploads

function ReportForm() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Handle File Selection (Excel Only)
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];

    // ✅ Allow only Excel (.xlsx) files
    if (selectedFile && selectedFile.name.endsWith(".xlsx")) {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid Excel (.xlsx) file!");
      setFile(null);
    }
  };

  // ✅ Upload Excel File to Cloudinary
  const uploadFileToCloudinary = async () => {
    if (!file) {
      console.error("No file selected.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "reports_upload"); // ✅ Must match your Cloudinary preset

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dr522t5us/raw/upload`, // ✅ Replace with your actual Cloud Name
        formData
      );

      console.log("Cloudinary Upload Success:", response.data);
      return response.data.secure_url; // ✅ Cloudinary file URL
    } catch (error) {
      console.error("Cloudinary Upload Error:", error.response ? error.response.data : error.message);
      alert("File upload failed! Check console for details.");
      return null;
    }
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !summary || !date) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true); // 🔄 Show loading state

    // ✅ Upload file to Cloudinary first
    let fileUrl = null;
    if (file) {
      fileUrl = await uploadFileToCloudinary();
      if (!fileUrl) {
        alert("File upload failed! Try again.");
        setLoading(false);
        return;
      }
    }

    // ✅ Store report in Firestore
    try {
      await addDoc(collection(db, "reports"), {
        title,
        summary,
        date,
        fileUrl, // ✅ Store Cloudinary file link in Firestore
      });

      // ✅ Reset form fields
      setTitle("");
      setSummary("");
      setDate("");
      setFile(null);

      alert("Report added successfully!");
    } catch (error) {
      console.error("Firestore Error:", error);
      alert("Failed to save report to Firestore.");
    }

    setLoading(false); // ✅ Hide loading state
  };

  return (
    <Paper sx={{ p: 4, mt: 2 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Title" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <TextField label="Summary" variant="outlined" multiline rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} required />
        <TextField type="date" variant="outlined" value={date} onChange={(e) => setDate(e.target.value)} required />

        {/* ✅ File Input for Excel */}
        <input type="file" accept=".xlsx" onChange={handleFileSelect} />
        {file && <p>Selected File: {file.name}</p>}

        <Button type="submit" variant="contained" color="success" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Paper>
  );
}

export default ReportForm;
