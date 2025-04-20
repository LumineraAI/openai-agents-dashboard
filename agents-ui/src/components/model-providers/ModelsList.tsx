import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
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
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { Model, ModelProvider } from '../../types/modelProvider';
import ModelForm from './ModelForm';
import { fetchModelsByProvider, deleteModel } from '../../services/modelService';

interface ModelsListProps {
  providerId: string;
  providerName: string;
}

const ModelsList: React.FC<ModelsListProps> = ({ providerId, providerName }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [currentModel, setCurrentModel] = useState<Model | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null);

  const loadModels = async () => {
    setLoading(true);
    try {
      const data = await fetchModelsByProvider(providerId);
      setModels(data);
      setError(null);
    } catch (err) {
      setError('Failed to load models');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (providerId) {
      loadModels();
    }
  }, [providerId]);

  const handleAddModel = () => {
    setCurrentModel(null);
    setOpenForm(true);
  };

  const handleEditModel = (model: Model) => {
    setCurrentModel(model);
    setOpenForm(true);
  };

  const handleDeleteClick = (model: Model) => {
    setModelToDelete(model);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (modelToDelete) {
      try {
        await deleteModel(providerId, modelToDelete.id);
        setOpenDeleteDialog(false);
        loadModels();
      } catch (err) {
        setError('Failed to delete model');
        console.error(err);
      }
    }
  };

  const handleFormClose = (refreshList: boolean = false) => {
    setOpenForm(false);
    if (refreshList) {
      loadModels();
    }
  };

  const formatParameters = (params: Record<string, any> | null | undefined) => {
    if (!params) return 'None';
    return Object.entries(params)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ');
  };

  return (
    <Box mt={4}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Models for {providerName}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={handleAddModel}
              size="small"
            >
              Add Model
            </Button>
          </Box>

          {error && (
            <Box mb={3}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          {loading ? (
            <Typography>Loading models...</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Display Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Context Window</TableCell>
                    <TableCell>Default Parameters</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {models.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2">No models found for this provider</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    models.map((model) => (
                      <TableRow key={model.id}>
                        <TableCell>{model.name}</TableCell>
                        <TableCell>{model.display_name}</TableCell>
                        <TableCell>{model.model_type}</TableCell>
                        <TableCell>{model.context_window || 'N/A'}</TableCell>
                        <TableCell>
                          <Typography variant="body2" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {formatParameters(model.default_parameters)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={model.is_active ? 'Active' : 'Inactive'} 
                            color={model.is_active ? 'success' : 'default'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            color="primary" 
                            onClick={() => handleEditModel(model)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDeleteClick(model)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </AccordionDetails>
      </Accordion>

      <ModelForm 
        open={openForm} 
        onClose={handleFormClose} 
        model={currentModel} 
        providerId={providerId}
      />

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the model "{modelToDelete?.display_name}"?
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

export default ModelsList;