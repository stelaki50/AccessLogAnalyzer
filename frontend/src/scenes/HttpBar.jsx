import { Box, useTheme } from "@mui/material";
import Header from "../components/Header";
import React, { useState, useEffect } from 'react';
import { tokens } from "../theme";
import { getStatusCodesPerMinute } from "../services/fetchData";
import HttpChart from "../charts/HttpChart";



const HttpBar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [statusCodePerMinute, setStatusCodePerMinute] = useState(null);
    const [httpMethodChart, setHttpMethodChart] = useState({ labels: [], data: [] });
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statusCodesPerMinuteRes = await getStatusCodesPerMinute();
                setStatusCodePerMinute(statusCodesPerMinuteRes)
                
            }catch (error) {
                console.error(error);
            }
        };
            fetchData();
        }, []);

    
    
    useEffect(() => {
        if (!statusCodePerMinute) return;
      
        const methods = Object.keys(statusCodePerMinute); 
        const count = Object.values(statusCodePerMinute); 
    
    
        setHttpMethodChart({
            labels: methods,
            data: count,
        });
    
      }, [statusCodePerMinute]);
    
  
      
    return (
      <Box m="20px">
        <Header title="Bar Chart" subtitle="This chart displays distribution of Status Codes Per Minute " />
        <Box height="75vh" display="flex" justifyContent="center" alignItems="center" border={`1px solid ${colors.grey[100]}`}>
          <HttpChart
            labels={httpMethodChart.labels}
            data={httpMethodChart.data}
            variant={"large"}
          />     
        </Box>
      </Box>
    );
  
}
export default HttpBar;