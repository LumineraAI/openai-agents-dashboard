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
  Box,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Model, ModelCreate, ModelUpdate } from '../../types/modelProvider';
import { createModel, updateModel } from '../../services/modelService';
import JSONEditor from '../common/JSONEditor';

interface ModelFormProps {
  open: boolean;
  onClose: (refreshList?: boolean) => void;
  model: Model | null;
  providerId: string;
}

const MODEL_TYPES = [
  { value: 'chat', label: 'Chat' },
  { value: 'completion', label: 'Completion' },
  { value: 'embedding', label: 'Embedding' },
  { value: 'image', label: 'Image Generation' },
  { value: 'audio', label: 'Audio' }
];

const ModelForm: React.FC<ModelFormProps> = ({ open, onClose, model, providerId }) => {
  const [formData, setFormData] = useState<ModelCreate | ModelUpdate>({
    name: '',
    display_name: '',
    description: '',
    model_type: 'chat',
    context_window: undefined,
    is_active: true,
    default_parameters: {}
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (model) {
      setFormData({
        name: model.name,
        display_name: model.display_name,
        description: model.description || '',
        model_type: model.model_type,
        context_window: model.context_window,
        is_active: model.is_active,
        default_parameters: model.default_parameters || {}
      });
    } else {
      setFormData({
        name: '',
        display_name: '',
        description: '',
        model_type: 'chat',
        context_window: undefined,
        is_active: true,
        default_parameters: {}
      });
    }
    setErrors({});
  }, [model, open]);

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
    
    if (!formData.model_type) {
      newErrors.model_type = 'Model type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name) {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : (name === 'context_window' && value ? parseInt(value as string, 10) : value)
      });
    }
  };

  const handleParametersChange = (value: Record<string, any>) => {
    setFormData({
      ...formData,
      default_parameters: value
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    try {
      if (model) {
        await updateModel(providerId, model.id, formData as ModelUpdate);
      } else {
        const modelCreate: ModelCreate = {
          ...formData as ModelCreate,
          provider_id: providerId
        };
        await createModel(providerId, modelCreate);
      }
      onClose(true);
    } catch (err) {
      console.error('Error saving model:', err);
      // Handle API errors here
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="md" fullWidth>
      <DialogTitle>{model ? 'Edit Model' : 'Add Model'}</DialogTitle>
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
                helperText={errors.name || 'Unique identifier (e.g., gpt-4, claude-3)'}
                disabled={!!model} // Name cannot be changed after creation
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
                helperText={errors.display_name || 'Human-readable name (e.g., GPT-4, Claude 3)'}
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
              <FormControl fullWidth required error={!!errors.model_type}>
                <InputLabel>Model Type</InputLabel>
                <Select
                  name="model_type"
                  value={formData.model_type}
                  onChange={handleChange}
                  label="Model Type"
                >
                  {MODEL_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="context_window"
                label="Context Window"
                type="number"
                value={formData.context_window || ''}
                onChange={handleChange}
                fullWidth
                helperText="Maximum context length in tokens (leave empty if unknown)"
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
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Default Parameters
              </Typography>
              <JSONEditor
                value={formData.default_parameters || {}}
                onChange={handleParametersChange}
                height="200px"
              />
              <Typography variant="caption" color="textSecondary">
                Default parameters to use with this model (e.g., temperature, max_tokens)
              </Typography>
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

export default ModelForm;