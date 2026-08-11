import { useState, useEffect } from "react"; // 
import { useTheme } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getTopEndpoints } from "../../services/fetchData";
import { tokens } from "../../theme";

export default function EndpointsTable({ maxHeight }) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode); 
  const [topEndpoints, setTopEndpoints] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topEndpoints = await getTopEndpoints();
        setTopEndpoints(topEndpoints);

      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []); 

 
  return (
    <TableContainer component={Paper} sx={{ backgroundColor: colors.primary[700],maxHeight: maxHeight, height: "fit-content",overflowY: "auto",}}> 
      <Table sx={{ minWidth: 450 }}  size="medium" aria-label="top endpoints table">
        <TableHead>
          <TableRow>
            <TableCell  sx={{fontSize: 18, fontWeight: "bold", color: colors.blueAccent[400], width: "75%",}}>
                Top Endpoints
            </TableCell>
            <TableCell align="right" sx={{ fontSize: 18,fontWeight: "bold",  color: colors.blueAccent[400], width: "25%",}}>
                Count
            </TableCell >
          </TableRow>
        </TableHead>
        <TableBody>
          {topEndpoints.map((row) => ( 
            <TableRow
              key={row.url} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.url} 
              </TableCell>
              <TableCell align="right">
                {row.count}
              </TableCell> 
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}