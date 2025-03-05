import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Modal, Box, TextField } from "@mui/material";
import { Link } from "react-router-dom";

function ReportList() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Modal State
  const [open, setOpen] = useState(false);
  const [editReport, setEditReport] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");

  // ✅ Fetch Reports from Firestore
  useEffect(() => {
    const fetchReports = async () => {
      const querySnapshot = await getDocs(collection(db, "reports"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(data);
      setFilteredReports(data);
    };
    fetchReports();
  }, []);

  // ✅ Search Functionality
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);
    setFilteredReports(reports.filter(report => report.title.toLowerCase().includes(value)));
  };

  // ✅ Open Edit Modal
  const handleOpen = (report) => {
    setEditReport(report);
    setNewTitle(report.title);
    setNewSummary(report.summary);
    setOpen(true);
  };

  // ✅ Close Modal
  const handleClose = () => {
    setOpen(false);
    setEditReport(null);
  };

  // ✅ Update Firestore Report
  const handleUpdate = async () => {
    if (!editReport) return;

    const reportRef = doc(db, "reports", editReport.id);
    await updateDoc(reportRef, { title: newTitle, summary: newSummary });

    setReports(reports.map(r => (r.id === editReport.id ? { ...r, title: newTitle, summary: newSummary } : r)));
    setFilteredReports(filteredReports.map(r => (r.id === editReport.id ? { ...r, title: newTitle, summary: newSummary } : r)));
    
    alert("Report updated successfully!");
    handleClose();
  };

  // ✅ Delete Report
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      await deleteDoc(doc(db, "reports", id));
      setReports(reports.filter(report => report.id !== id));
      setFilteredReports(filteredReports.filter(report => report.id !== id));
      alert("Report deleted!");
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3, p: 2 }}>
        <Typography variant="h5" sx={{ p: 2 }}>Meeting Reports</Typography>

        {/* 🔹 Search Input */}
        <TextField
          label="Search Reports"
          variant="outlined"
          fullWidth
          value={search}
          onChange={handleSearch}
          sx={{ mb: 2 }}
        />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Title</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Summary</b></TableCell>
              <TableCell><b>Excel File</b></TableCell> {/* ✅ Updated Download Button Column */}
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.map(report => (
              <TableRow key={report.id}>
                <TableCell>{report.title}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.summary}</TableCell>

                {/* ✅ Excel File Download Button */}
                <TableCell>
                  {report.fileUrl ? (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small" 
                      onClick={() => window.open(report.fileUrl, "_blank")}
                    >
                      Download Excel
                    </Button>
                  ) : (
                    "No file"
                  )}
                </TableCell>

                {/* ✅ Actions */}
                <TableCell>
                  <Link to={`/report/${report.id}`} style={{ color: "blue", textDecoration: "none", marginRight: "10px" }}>
                    View Details
                  </Link>
                  <Button variant="outlined" color="primary" size="small" onClick={() => handleOpen(report)} sx={{ mx: 1 }}>
                    Edit
                  </Button>
                  <Button variant="contained" color="error" size="small" onClick={() => handleDelete(report.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Edit Popup Modal */}
      <Modal open={open} onClose={handleClose} aria-labelledby="edit-report-modal" aria-describedby="edit-report-description">
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400, bgcolor: 'background.paper',
          boxShadow: 24, p: 4, borderRadius: 2
        }}>
          <Typography variant="h6" id="edit-report-modal">Edit Report</Typography>
          <TextField
            label="Title"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Summary"
            fullWidth
            multiline
            rows={3}
            value={newSummary}
            onChange={(e) => setNewSummary(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ mt: 2, mr: 2 }}>Save</Button>
          <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ mt: 2 }}>Cancel</Button>
        </Box>
      </Modal>
    </>
  );
}

export default ReportList;
