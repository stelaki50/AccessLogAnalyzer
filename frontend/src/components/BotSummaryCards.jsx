import React, { useState, useEffect } from 'react';
import { Box, Paper } from "@mui/material";  
import MuiCard from "../components/Card";
import { getTotalSessions,getEmptyUaCount,getTotalRobotTxt,getTotalLogEntries } from "../services/fetchData";


const BotSummaryCards = () => {

  
 const [totalSessions, setTotalSessions] = useState(null);  
 const [emptyUaCount, setEmptyUaCount] = useState(null);  
 const [totalRobotTxt, setTotalRobotTxt] = useState(null);  
 const [totalLogEntries, setTotalLogEntries] = useState(null);  


  useEffect(() => {

      const fetchData = async () => {
        try {

          const totalLogEntries = await getTotalLogEntries();
          const totalSessions = await getTotalSessions();
          const emptyUaCount = await getEmptyUaCount();
          const totalRobotTxt = await getTotalRobotTxt();
          
          setTotalLogEntries(totalLogEntries)
          setTotalSessions(totalSessions)
          setEmptyUaCount(emptyUaCount)
          setTotalRobotTxt(totalRobotTxt)

        }catch (error) {
            console.error(error);
        }
    };
      fetchData();

  },[]);


  return(

      <Box sx={{ display: "flex", gap: 2 }}>
  <Box sx={{ width: "100%", display: "flex", flexWrap: "nowrap", gap: 2 }}>
    <Box sx={{ flex: 1 }}>
      <MuiCard title="Total Log Entries" value={totalLogEntries ?? 0} color="#ADD8E6" />
    </Box>

    <Box sx={{ flex: 1 }}>
      <MuiCard title="Total Sessions" value={totalSessions ?? 0} color="#ADD8E6" />
    </Box>

    <Box sx={{ flex: 1 }}>
      <MuiCard title="Total Request with empty User Agent String" value={emptyUaCount ?? 0}color="#ADD8E6" />
    </Box>

    <Box sx={{ flex: 1 }}>
      <MuiCard title="Total Robot.txt Requests" value={totalRobotTxt ?? 0} color="#ADD8E6" />
    </Box>
  </Box>
</Box>

  );}


export default BotSummaryCards;