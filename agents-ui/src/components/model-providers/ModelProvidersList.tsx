import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { ModelProvider } from '../../types/modelProvider';
import ModelProviderForm from './ModelProviderForm';
import { fetchModelProviders, deleteModelProvider } from '../../services/modelProviderService';

const ModelProvidersList: React.FC = () => {
  const [modelProviders, setModelProviders] = useState<ModelProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [currentProvider, setCurrentProvider] = useState<ModelProvider | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [providerToDelete, setProviderToDelete] = useState<ModelProvider | null>(null);

  const loadModelProviders = async () => {
    setLoading(true);
    try {
      const data = await fetchModelProviders();
      setModelProviders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load model providers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModelProviders();
  }, []);

  const handleAddProvider = () => {
    setCurrentProvider(null);
    setOpenForm(true);
  };

  const handleEditProvider = (provider: ModelProvider) => {
    setCurrentProvider(provider);
    setOpenForm(true);
  };

  const handleDeleteClick = (provider: ModelProvider) => {
    setProviderToDelete(provider);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (providerToDelete) {
      try {
        await deleteModelProvider(providerToDelete.id);
        setOpenDeleteDialog(false);
        loadModelProviders();
      } catch (err) {
        setError('Failed to delete model provider');
        console.error(err);
      }
    }
  };

  const handleFormClose = (refreshList: boolean = false) => {
    setOpenForm(false);
    if (refreshList) {
      loadModelProviders();
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Model Providers</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddProvider}
        >
          Add Provider
        </Button>
      </Box>

      {error && (
        <Box mb={3}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Display Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>API Base URL</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {modelProviders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1">No model providers found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                modelProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>{provider.name}</TableCell>
                    <TableCell>{provider.display_name}</TableCell>
                    <TableCell>{provider.description}</TableCell>
                    <TableCell>{provider.api_base_url}</TableCell>
                    <TableCell>
                      <Chip 
                        label={provider.is_active ? 'Active' : 'Inactive'} 
                        color={provider.is_active ? 'success' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleEditProvider(provider)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDeleteClick(provider)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ModelProviderForm 
        open={openForm} 
        onClose={handleFormClose} 
        provider={currentProvider} 
      />

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the model provider "{providerToDelete?.display_name}"? 
            This will also delete all associated models.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModelProvidersList;