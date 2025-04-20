import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 240;

const Layout: React.FC = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header 
        open={open} 
        drawerWidth={DRAWER_WIDTH} 
        toggleDrawer={toggleDrawer} 
      />
      <Sidebar 
        open={open} 
        drawerWidth={DRAWER_WIDTH} 
        toggleDrawer={toggleDrawer} 
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar /> {/* This creates space below the fixed app bar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;