import api from './api';

export const createSegment = async (segmentData) => {
  const response = await api.post('/segments', segmentData);
  return response.data;
};

export const getSegments = async () => {
  const response = await api.get('/segments');
  return response.data;
};

export const generateSegmentFromText = async (text) => {
  const response = await api.post('/segments/generate', { text });
  return response.data;
};

export const previewSegment = async (rules) => {
  const response = await api.post('/segments/preview', { rules });
  return response.data;
};