import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControlLabel, 
  Switch,
  Grid,
  Typography,
  Box
} from '@mui/material';
import { ModelProvider, ModelProviderCreate, ModelProviderUpdate } from '../../types/modelProvider';
import { createModelProvider, updateModelProvider } from '../../services/modelProviderService';

interface ModelProviderFormProps {
  open: boolean;
  onClose: (refreshList?: boolean) => void;
  provider: ModelProvider | null;
}

const ModelProviderForm: React.FC<ModelProviderFormProps> = ({ open, onClose, provider }) => {
  const [formData, setFormData] = useState<ModelProviderCreate | ModelProviderUpdate>({
    name: '',
    display_name: '',
    description: '',
    api_base_url: '',
    api_key_env_var: '',
    is_active: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (provider) {
      setFormData({
        name: provider.name,
        display_name: provider.display_name,
        description: provider.description || '',
        api_base_url: provider.api_base_url || '',
        api_key_env_var: provider.api_key_env_var || '',
        is_active: provider.is_active
      });
    } else {
      setFormData({
        name: '',
        display_name: '',
        description: '',
        api_base_url: '',
        api_key_env_var: '',
        is_active: true
      });
    }
    setErrors({});
  }, [provider, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-z0-9_-]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain lowercase letters, numbers, underscores, and hyphens';
    }
    
    if (!formData.display_name) {
      newErrors.display_name = 'Display name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    try {
      if (provider) {
        await updateModelProvider(provider.id, formData as ModelProviderUpdate);
      } else {
        await createModelProvider(formData as ModelProviderCreate);
      }
      onClose(true);
    } catch (err) {
      console.error('Error saving model provider:', err);
      // Handle API errors here
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="md" fullWidth>
      <DialogTitle>{provider ? 'Edit Model Provider' : 'Add Model Provider'}</DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name || 'Unique identifier (e.g., openai, anthropic)'}
                disabled={!!provider} // Name cannot be changed after creation
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="display_name"
                label="Display Name"
                value={formData.display_name}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.display_name}
                helperText={errors.display_name || 'Human-readable name (e.g., OpenAI, Anthropic)'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="api_base_url"
                label="API Base URL"
                value={formData.api_base_url}
                onChange={handleChange}
                fullWidth
                helperText="Base URL for API requests (e.g., https://api.openai.com/v1)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="api_key_env_var"
                label="API Key Environment Variable"
                value={formData.api_key_env_var}
                onChange={handleChange}
                fullWidth
                helperText="Environment variable name for the API key (e.g., OPENAI_API_KEY)"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} disabled={submitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained" 
          disabled={submitting}
        >
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModelProviderForm;