export interface Model {
  id: string;
  provider_id: string;
  name: string;
  display_name: string;
  description?: string;
  model_type: string;
  context_window?: number;
  is_active: boolean;
  default_parameters?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ModelCreate {
  provider_id: string;
  name: string;
  display_name: string;
  description?: string;
  model_type: string;
  context_window?: number;
  is_active: boolean;
  default_parameters?: Record<string, any>;
}

export interface ModelUpdate {
  name?: string;
  display_name?: string;
  description?: string;
  model_type?: string;
  context_window?: number;
  is_active?: boolean;
  default_parameters?: Record<string, any>;
}

export interface ModelProvider {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  api_base_url?: string;
  api_key_env_var?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  models?: Model[];
}

export interface ModelProviderCreate {
  name: string;
  display_name: string;
  description?: string;
  api_base_url?: string;
  api_key_env_var?: string;
  is_active: boolean;
}

export interface ModelProviderUpdate {
  name?: string;
  display_name?: string;
  description?: string;
  api_base_url?: string;
  api_key_env_var?: string;
  is_active?: boolean;
}