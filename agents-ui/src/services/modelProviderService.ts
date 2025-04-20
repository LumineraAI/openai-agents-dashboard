import { ModelProvider, ModelProviderCreate, ModelProviderUpdate } from '../types/modelProvider';
import { api } from './api';

const BASE_URL = '/api/v1/model-providers';

export const fetchModelProviders = async (): Promise<ModelProvider[]> => {
  const response = await api.get(BASE_URL);
  return response.data;
};

export const fetchModelProvidersWithModels = async (): Promise<ModelProvider[]> => {
  const response = await api.get(`${BASE_URL}/with-models`);
  return response.data;
};

export const fetchModelProvider = async (id: string): Promise<ModelProvider> => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const fetchModelProviderWithModels = async (id: string): Promise<ModelProvider> => {
  const response = await api.get(`${BASE_URL}/${id}/with-models`);
  return response.data;
};

export const createModelProvider = async (data: ModelProviderCreate): Promise<ModelProvider> => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

export const updateModelProvider = async (id: string, data: ModelProviderUpdate): Promise<ModelProvider> => {
  const response = await api.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteModelProvider = async (id: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};