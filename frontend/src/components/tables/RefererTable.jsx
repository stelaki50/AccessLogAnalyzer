import { useState, useEffect } from "react"; 
import { useTheme } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getTopReferers } from "../../services/fetchData";
import { tokens } from "../../theme";


export default function RefererTable({ maxHeight }) { 

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [topReferers, setTopReferers] = useState([]); 

  // Fetch the data for the Referer Table
  useEffect(() => {
    const fetchData = async () => {
      try {
        const topReferers = await getTopReferers();
        setTopReferers(topReferers);

      }catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []); 


  return (
    <TableContainer
      component={Paper} sx={{ backgroundColor: colors.primary[700],maxHeight: maxHeight, height: "fit-content", overflowY: "auto",}}>
      <Table stickyHeader sx={{ minWidth: 430 }} aria-label="Top Referers Table "> 
        <TableHead>
          <TableRow>

            <TableCell sx={{ fontSize: 18, fontWeight: "bold", color: colors.greenAccent[400], width: "75%",}}>
                Top Referers
            </TableCell>
            <TableCell align="right"  sx={{ fontSize: 18, fontWeight: "bold", color: colors.greenAccent[400],}}>
                Count
            </TableCell>

          </TableRow>
        </TableHead>

        <TableBody>
          {topReferers.map((row) => (
            <TableRow
              key={row.domain} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.domain}
              </TableCell>
              <TableCell align="right">{row.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}