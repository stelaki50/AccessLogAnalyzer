import { Box,useTheme } from "@mui/material";

import Header from "../components/Header";
import { tokens } from "../theme";


import HttpOverview from "./HttpOverview";
import TrafficBehaviour from "./TrafficBehavior"


export default function SecurityAnalysis() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  
  return (
      <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Security Analysis" subtitle="Welcome to your Security Analysis" />
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="minmax(140px, auto)" gap="20px">
          

          <Box gridColumn="span 12" backgroundColor={colors.primary[400]} p="20px">
          <HttpOverview/>
        </Box> 
 
         <Box gridColumn="span 12" backgroundColor={colors.primary[400]} p="20px">
          <TrafficBehaviour/>
        </Box> 
 
 {/* 
        <Box gridColumn="span 12" backgroundColor={colors.primary[400]} p="20px">
          <PersentagesBox />
        </Box> */}


      
      </Box>

      </Box>

    );
}

