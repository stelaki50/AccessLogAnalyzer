import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getBotIpAddresses } from "../../services/fetchData";
import { tokens } from "../../theme";

export default function EndpointsTable({ maxHeight }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [botIP, setBotIP] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const data = await getBotIpAddresses();
        const botIPArray = Array.from(data, ([ip, reason]) => ({ip,reason,}));
        setBotIP(botIPArray);

      } catch (error) {
        console.error("Error fetching bot IP addresses:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <TableContainer
      component={Paper} sx={{backgroundColor: colors.primary[700], maxHeight: maxHeight, height: "fit-content", overflowY: "auto",}}>
      <Table sx={{minWidth: 450,}} size="medium" aria-label="bot ips" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{fontSize: 18, fontWeight: "bold", color: colors.blueAccent[400],backgroundColor: colors.primary[500],}}>
                Bot Activity Detection
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {botIP.map((row) => (
            <TableRow key={row.ip}sx={{ "&:last-child td, &:last-child th": {border: 0,},}}>
              <TableCell align="center" sx={{ fontSize: 16, padding: "14px 24px",}}>
                <strong>{row.ip}</strong>
                {" — "}
                {row.reason}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}