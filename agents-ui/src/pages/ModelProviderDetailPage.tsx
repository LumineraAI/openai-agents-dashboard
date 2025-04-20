import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Chip,
  Divider,
  IconButton,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { ModelProvider } from '../types/modelProvider';
import { fetchModelProviderWithModels } from '../services/modelProviderService';
import ModelsList from '../components/model-providers/ModelsList';
import ModelProviderForm from '../components/model-providers/ModelProviderForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const ModelProviderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<ModelProvider | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openEditForm, setOpenEditForm] = useState<boolean>(false);

  const loadProvider = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await fetchModelProviderWithModels(id);
      setProvider(data);
      setError(null);
    } catch (err) {
      setError('Failed to load model provider details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProvider();
  }, [id]);

  const handleEditClick = () => {
    setOpenEditForm(true);
  };

  const handleEditClose = (refreshData: boolean = false) => {
    setOpenEditForm(false);
    if (refreshData) {
      loadProvider();
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!provider) {
    return <ErrorMessage message="Model provider not found" />;
  }

  return (
    <Box>
      <Box mb={3}>
        <Breadcrumbs>
          <Link 
            color="inherit" 
            component="button"
            onClick={() => navigate('/model-providers')}
          >
            Model Providers
          </Link>
          <Typography color="textPrimary">{provider.display_name}</Typography>
        </Breadcrumbs>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton 
            onClick={() => navigate('/model-providers')}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">{provider.display_name}</Typography>
          <Chip 
            label={provider.is_active ? 'Active' : 'Inactive'} 
            color={provider.is_active ? 'success' : 'default'} 
            size="small"
            sx={{ ml: 2 }}
          />
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<EditIcon />}
          onClick={handleEditClick}
        >
          Edit Provider
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Name
              </Typography>
              <Typography variant="body1">
                {provider.name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                API Base URL
              </Typography>
              <Typography variant="body1">
                {provider.api_base_url || 'Not specified'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                API Key Environment Variable
              </Typography>
              <Typography variant="body1">
                {provider.api_key_env_var || 'Not specified'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Description
              </Typography>
              <Typography variant="body1">
                {provider.description || 'No description provided'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <ModelsList 
        providerId={provider.id} 
        providerName={provider.display_name} 
      />

      <ModelProviderForm 
        open={openEditForm} 
        onClose={handleEditClose} 
        provider={provider} 
      />
    </Box>
  );
};

export default ModelProviderDetailPage;