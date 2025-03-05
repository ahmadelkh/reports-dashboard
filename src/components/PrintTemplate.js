import React, { forwardRef } from "react";
import { Paper, Typography } from "@mui/material";

// ✅ Use forwardRef to allow react-to-print to access the component
const PrintTemplate = forwardRef(({ report }, ref) => {
  if (!report) return null; // ❌ Prevent printing an empty template

  return (
    <Paper ref={ref} sx={{ p: 4, mt: 3 }}>
      <Typography variant="h4" textAlign="center">{report.title || "Untitled Report"}</Typography>
      <Typography sx={{ mt: 2 }}>{report.summary || "No summary available"}</Typography>
      <Typography sx={{ mt: 2 }}>Date: {report.date || "No date provided"}</Typography>
    </Paper>
  );
});

export default PrintTemplate;
