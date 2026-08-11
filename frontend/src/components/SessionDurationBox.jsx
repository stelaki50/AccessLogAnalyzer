import { getSessionDurations, } from "../services/fetchData";
import { Box, Paper } from "@mui/material";  
import React, { useState, useEffect } from 'react';
import SessionDurationChart from "../charts/SessionDurationChart";
import CrawlersTable from "../components/tables/CrawlersTable"


const SessionDurationBox = () => {

    const [barData, setBarData] = useState({ labels: [], data: [] });
    const [sessionDuration, setSessionDuration] = useState(null);

    
    // Fetch the data for the Session Duration Horizontal Bar Chart 
    useEffect(() => {
        const fetchData = async () => {
        try {
            const sessionDuration = await getSessionDurations();
            setSessionDuration(sessionDuration);     
        }catch (error) {
            console.error(error);
        }
    };
        fetchData();
    },[]);


  //Set the Session Duration Horizontal Bar Chart data
  useEffect(() => {

    if (!sessionDuration) return;

    const entries = Object.entries(sessionDuration); 
    setBarData({
      labels: entries.map(([ip]) => ip),
      data: entries.map(([, duration]) => duration),
    });
  },[sessionDuration]);
    
return(


  <Box display="flex" gap={2} width="100%">
       
    <CrawlersTable maxHeight={500}></CrawlersTable>
    <Paper  elevation={3} sx={{ flex: 1, p: 2, height: "400px", }}> 
        <SessionDurationChart
          labels={barData.labels}
          data={barData.data}
          variant={"small"}/>
    </Paper>
    
  </Box>


);}
export default SessionDurationBox;