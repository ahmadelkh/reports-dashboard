import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { Paper, Typography, CircularProgress, Box, Button } from "@mui/material";
import jsPDF from "jspdf";

function ReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      const docRef = doc(db, "reports", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setReport(docSnap.data());
      } else {
        console.error("❌ No document found in Firestore");
        setReport(null);
      }
      setLoading(false);
    };

    fetchReport();
  }, [id]);

  // ✅ Function to generate and download a structured PDF
  const handleDownloadPDF = () => {
    if (!report) {
      alert("The report data is missing. Try again.");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth(); // Get PDF width

    // ✅ Load the logo (Ensure the logo is in `public/logo.png`)
    const logo = new Image();
    logo.src = `${process.env.PUBLIC_URL}/logo.png`; // ✅ Correct path for GitHub Pages
    logo.onload = () => {
      const logoWidth = 50;
      const logoHeight = 50;
      const centerX = (pageWidth - logoWidth) / 2; // Center the logo

      doc.addImage(logo, "PNG", centerX, 10, logoWidth, logoHeight); // ✅ Center logo

      // ✅ Add Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      const titleText = "Report Details";
      const titleWidth = doc.getTextWidth(titleText);
      doc.text(titleText, (pageWidth - titleWidth) / 2, 70); // ✅ Center title

      // ✅ Add Date
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const dateText = `Date: ${report.date || "Not provided"}`;
      const dateWidth = doc.getTextWidth(dateText);
      doc.text(dateText, (pageWidth - dateWidth) / 2, 85); // ✅ Center date

      // ✅ Add Report Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      const reportTitleText = `Title: ${report.title || "Untitled Report"}`;
      const reportTitleWidth = doc.getTextWidth(reportTitleText);
      doc.text(reportTitleText, (pageWidth - reportTitleWidth) / 2, 100); // ✅ Center report title

      // ✅ Add Description
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const splitText = doc.splitTextToSize(report.summary || "No description available", 180);
      doc.text("Description:", 10, 120);
      doc.text(splitText, 10, 130);

      // ✅ Save the PDF
      doc.save(`${report.title || "Report"}.pdf`);
    };
  };

  if (loading) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;
  if (!report) return <Typography variant="h6" textAlign="center" mt={4}>Report not found.</Typography>;

  return (
    <Box sx={{ textAlign: "center", mt: 3 }}>
      {/* 🔹 Styled Report Details */}
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="Company Logo"
          style={{ width: 100, marginBottom: 10 }}
        />
        <Typography variant="h4">{report.title}</Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>Date: {report.date || "No date provided"}</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>{report.summary}</Typography>
      </Paper>

      {/* 🔹 Export to PDF Button */}
      <Button
        variant="contained"
        sx={{ mt: 3, bgcolor: "#7B1FA2", color: "white", "&:hover": { bgcolor: "#6A1B9A" } }}
        onClick={handleDownloadPDF}
      >
        DOWNLOAD AS PDF
      </Button>
    </Box>
  );
}

export default ReportDetails;
