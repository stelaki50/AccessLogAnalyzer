import { Box,useTheme } from "@mui/material";
import HttpStatusCodeBox from "../components/HttpStatusCodeBox";
import CountriesPerIpBox from "../components/CountriesPerIpBox";
import TrafficBox from "../components/TrafficBox";
import sessionDurationBox from  "../components/SessionDurationBox";


import Header from "../components/Header";
import { tokens } from "../theme";


export default function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  
  return (
    <Box m="20px">
       <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="DASHBOARD" subtitle="Welcome to your log analyzer" />
       </Box>

      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="minmax(140px, auto)" gap="20px">
          
          <Box gridColumn="span 12" backgroundColor={colors.primary[400]} p="20px">
            <HttpStatusCodeBox />
          </Box>
  
          <Box gridColumn="span 12" backgroundColor={colors.primary[400]} p="20px">
            <TrafficBox />
          </Box>
  
          <Box gridColumn="span 12" backgroundColor={colors.primary[400]} p="20px">
            <CountriesPerIpBox />
          </Box>

        
      </Box>

    </Box>

    );
}
