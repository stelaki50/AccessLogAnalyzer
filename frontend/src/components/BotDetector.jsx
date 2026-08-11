import { Box,useTheme } from "@mui/material";
import SessionDurationBox from "../components/SessionDurationBox"
import PersentagesBox from "../components/PersentagesBox"

import Header from "../components/Header";
import { tokens } from "../theme";
import BotSummaryCards from "../components/BotSummaryCards";


export default function BotDetector() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Bot Detector" subtitle="Welcome to your bot detector" />
      </Box>

    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="minmax(140px, auto)" gap="20px">
          

        <Box gridColumn="span 12" backgroundColor={colors.primary[400]} p="20px">
          <BotSummaryCards/>
        </Box> 
 
        <Box gridColumn="span 12" backgroundColor={colors.primary[400]} p="20px">
          <SessionDurationBox/>
        </Box> 
 
 
        <Box gridColumn="span 12" backgroundColor={colors.primary[400]} p="20px">
          <PersentagesBox />
        </Box>
      
    </Box>

    </Box>

    );
}

