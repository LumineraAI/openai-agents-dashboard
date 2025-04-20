import { Model, ModelCreate, ModelUpdate } from '../types/modelProvider';
import { api } from './api';

const BASE_URL = '/api/v1/model-providers';

export const fetchModelsByProvider = async (providerId: string): Promise<Model[]> => {
  const response = await api.get(`${BASE_URL}/${providerId}/models`);
  return response.data;
};

export const fetchModel = async (providerId: string, modelId: string): Promise<Model> => {
  const response = await api.get(`${BASE_URL}/${providerId}/models/${modelId}`);
  return response.data;
};

export const createModel = async (providerId: string, data: ModelCreate): Promise<Model> => {
  const response = await api.post(`${BASE_URL}/${providerId}/models`, data);
  return response.data;
};

export const updateModel = async (providerId: string, modelId: string, data: ModelUpdate): Promise<Model> => {
  const response = await api.put(`${BASE_URL}/${providerId}/models/${modelId}`, data);
  return response.data;
};

export const deleteModel = async (providerId: string, modelId: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${providerId}/models/${modelId}`);
};