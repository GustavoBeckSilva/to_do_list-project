import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllTarefas = () => {
  return apiClient.get('/tarefas');
};

export const getTarefaById = (id) => {
  return apiClient.get(`/tarefas/${id}`);
};

export const createTarefa = (tarefaData) => {
  return apiClient.post('/tarefas', tarefaData);
};

export const updateTarefa = (id, tarefaData) => {
  return apiClient.put(`/tarefas/${id}`, tarefaData);
};

export const deleteTarefa = (id) => {
  return apiClient.delete(`/tarefas/${id}`);
};

export const markTarefaAsConcluida = (id) => {
  return apiClient.patch(`/tarefas/${id}/concluida`);
};

export const markTarefaAsPendente = (id) => {
  return apiClient.patch(`/tarefas/${id}/pendente`);
};

export const getTarefasPendentes = () => {
  return apiClient.get('/tarefas/pendentes');
};

export const getTarefasConcluidas = () => {
  return apiClient.get('/tarefas/concluidas');
};

export default apiClient;