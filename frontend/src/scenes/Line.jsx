import { Box, useTheme } from "@mui/material";
import Header from "../components/Header";
import React, { useState, useEffect } from 'react';
import { tokens } from "../theme";
import LineChart from "../charts/LineChart";
import { getRequestPerMinute } from "../services/fetchData";

const Line = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [lineData, setLineData] = useState({ labels: [], data: [] });
    const [RequestPerMinute, setRequestPerMinute] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requests = await getRequestPerMinute();
                setRequestPerMinute(requests)
               
            }catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);
    
  //Set Line data
    useEffect(() => {
     if (!RequestPerMinute) return;
      
     //Sort the timestamps
     const sortedMap = new Map(
       [...RequestPerMinute].sort((a, b)=> a[0].localeCompare(b[0]))
    );
 
     const labels = [...sortedMap.keys()];
     const data = [...sortedMap.values()];
     
     setLineData({ labels, data });
 
    },[RequestPerMinute]);
    
    return (
        <Box m="20px">
          <Header title="Line Chart" subtitle="This chart displays the requests per minute " />
    
          <Box height="75vh" display="flex" justifyContent="center" alignItems="center" border={`1px solid ${colors.grey[100]}`}>
           <LineChart           
              labels={lineData.labels}
              data={lineData.data}
              variant={"large"}
              />
          </Box>
        </Box>
      );
}
export default Line;