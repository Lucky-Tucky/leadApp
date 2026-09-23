import api from '../Config/AxiosConfig';

const path = "/leads";

export const getLeads = async (page = 1, limit = 10) => {
    const response = await api.get(`${path}?page=${page}&limit=${limit}`);
    return response.data;
};

export const updateLead = async (id, data) => {
    const response = await api.patch(`${path}/${id}`, data);
    return response.data;
};