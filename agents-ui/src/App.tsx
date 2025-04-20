import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ModelProvidersPage from './pages/ModelProvidersPage';
import ModelProviderDetailPage from './pages/ModelProviderDetailPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="model-providers" element={<ModelProvidersPage />} />
          <Route path="model-providers/:id" element={<ModelProviderDetailPage />} />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Box>
  );
};

export default App;