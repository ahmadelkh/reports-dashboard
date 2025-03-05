import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import ReportForm from "./components/ReportForm";
import ReportList from "./components/ReportList";
import ReportDetails from "./components/ReportDetails";

function App() {
  return (
    <Router>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Reports Management System
        </Typography>
        <Routes>
          <Route path="/" element={<><ReportForm /><ReportList /></>} />
          <Route path="/report/:id" element={<ReportDetails />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
