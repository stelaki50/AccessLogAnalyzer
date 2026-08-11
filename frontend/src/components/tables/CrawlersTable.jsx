import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { tokens } from "../../theme";
import { getGeneralCrawlers,getAICrawlers, getSearchEngineCrawlers } from "../../services/fetchData";


export default function BotDetectorTable({ maxHeight }) {
  const [botData, setBotData] = useState({ searchEngineCrawlers: [], aICrawlers: [], generalCrawlers: [],});

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aICrawlersData = await getAICrawlers();
        const searchCrawlersData = await getSearchEngineCrawlers();
        const generalCrawlersData = await getGeneralCrawlers();

       setBotData({
            searchEngineCrawlers: Object.entries(searchCrawlersData).map(([name, count]) => ({name,count})),
            aICrawlers: Object.entries(aICrawlersData).map(([name, count]) => ({name,count})),
            generalCrawlers: Object.entries(generalCrawlersData).map(([name, count]) => ({name,count})),
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const { searchEngineCrawlers, aICrawlers, generalCrawlers } = botData;

  const maxRows = Math.max(searchEngineCrawlers.length,aICrawlers.length,generalCrawlers.length);

  const headerCellSx = {fontSize: 20,fontWeight: "bold",color: colors.blueAccent[500],};

  const nameHeaderCellSx = {fontSize: 16,fontWeight: "bold",color: colors.blueAccent[300], };

  return (
    <TableContainer
      component={Paper} sx={{ backgroundColor: colors.primary[700],maxHeight: maxHeight,height: "fit-content",overflowY: "auto",}}>
      <Table sx={{ minWidth: 650 }} size="medium" aria-label="bot detector table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={2} sx={headerCellSx}>
              Search Engine Crawlers
            </TableCell>
            <TableCell align="center" colSpan={2} sx={headerCellSx}>
              AI Crawlers
            </TableCell>
            <TableCell align="center" colSpan={2} sx={headerCellSx}>
              General Crawlers
            </TableCell>
          </TableRow>
          <TableRow>
           <TableCell sx={nameHeaderCellSx}>Name</TableCell>
            <TableCell align="right" sx={nameHeaderCellSx}>Count</TableCell>
            <TableCell sx={nameHeaderCellSx}>Name</TableCell>
            <TableCell align="right" sx={nameHeaderCellSx}>Count</TableCell>
            <TableCell sx={nameHeaderCellSx}>Name</TableCell>
            <TableCell align="right" sx={nameHeaderCellSx}>Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: maxRows }).map((_, index) => {
            const se = searchEngineCrawlers[index];
            const ai = aICrawlers[index];
            const gen = generalCrawlers[index];

            return (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {/* Search Engine Crawlers */}
                <TableCell component="th" scope="row">
                  {se ? se.name : ""}
                </TableCell>
                <TableCell align="right" > {se ? se.count : ""}</TableCell>

                {/* AI Crawlers */}
                <TableCell component="th" scope="row">
                  {ai ? ai.name : ""}
                </TableCell>
                <TableCell align="right">{ai ? ai.count : ""}</TableCell>

                {/* General Crawlers */}
                <TableCell component="th" scope="row">
                  {gen ? gen.name : ""}
                </TableCell>
                <TableCell align="right">{gen ? gen.count : ""}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}