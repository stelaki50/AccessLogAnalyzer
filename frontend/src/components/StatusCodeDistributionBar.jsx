import { useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { tokens } from "../theme";
import { getStatusCodeDistribution } from "../services/fetchData";

const STATUS_COLORS = {
  "2xx": "#4caf50", 
  "3xx": "#2979ff", 
  "4xx": "#ffa726", 
  "5xx": "#f44336", 
};

export default function StatusDistribution() { 
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [statusCodeDistribution, setStatusCodeDistribution] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusCodeDistribution = await getStatusCodeDistribution(); 
        setStatusCodeDistribution(statusCodeDistribution);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const toEntries = (statusCodeDistribution) =>
    statusCodeDistribution instanceof Map ? Array.from(statusCodeDistribution.entries()) : Object.entries(statusCodeDistribution || {});

  const percentEntries = toEntries(statusCodeDistribution).filter(([, val]) => val > 0);

  const errorPercent =
    (statusCodeDistribution?.["4xx"] || 0) + (statusCodeDistribution?.["5xx"] || 0);

  if (!statusCodeDistribution) {
    return (
      <Box sx={{ backgroundColor: colors.primary[700], borderRadius: 1, p: 2 }}>
        <Typography variant="body2" sx={{ color: colors.grey[300] }}>
          Loading status distribution...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: colors.primary[500], borderRadius: 1, p: 2 }}>
   
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", letterSpacing: 1, color: colors.grey[300] }}
        >
          STATUS DISTRIBUTION
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <ErrorOutlineIcon sx={{ fontSize: 16, color: colors.grey[300] }} />
          <Typography variant="body2" sx={{ color: colors.grey[300] }}>
            {errorPercent.toFixed(1)}% errors 
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{ display: "flex", width: "100%", height: 10, borderRadius: 5, overflow: "hidden", backgroundColor: colors.grey[800],}}>
        {percentEntries.map(([status, pct]) => (
          <Box key={status} sx={{width: `${pct}%` ,backgroundColor: STATUS_COLORS[status] || colors.grey[500], transition: "width 0.3s ease",}}/>
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 1.5, mt: 2, flexWrap: "wrap" }}>
        {percentEntries.map(([status, pct]) => (
          <Box key={status} sx={{ display: "flex", alignItems: "center", gap: 0.75, px: 1.25, py: 0.5, borderRadius: 5, backgroundColor: `${STATUS_COLORS[status]}22`,}}>
            <Box
              sx={{width: 8, height: 8, borderRadius: "50%", backgroundColor: STATUS_COLORS[status],}}/>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: STATUS_COLORS[status] }}
            >
              {status}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.grey[300] }}>
              {pct}% 
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}