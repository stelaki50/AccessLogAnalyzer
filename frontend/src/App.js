import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";
import IpBar from  "./scenes/IpBar";
import Geography from "./scenes/Geography";
import Doughnut from "./scenes/Doughnut";
import Line from "./scenes/Line";
import HttpBar from "./scenes/HttpBar";
import Dashboard from "./components/DashBoard";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <div className="app">
          <SideBar isSidebar={isSidebar} />
          <main className="content">
            <TopBar setIsSidebar={setIsSidebar} />
            
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/bar" element={<IpBar />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/doughnut" element={<Doughnut />} />
              <Route path="/line" element={<Line />} />
              <Route path="/httpBar" element={<HttpBar />} />

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;