import api from '../Config/AxiosConfig';

const path = "/leads";

export const getLeads = async (page = 1, limit = 10, search = "", status = "") => {
    let query = `${path}?page=${page}&limit=${limit}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;
    if (status) query += `&status=${encodeURIComponent(status)}`;
    const response = await api.get(query);
    return response.data;
};

export const getLeadById = async (id) => {
    const response = await api.get(`${path}/${id}`);
    return response.data;
};

export const updateLead = async (id, data) => {
    const response = await api.patch(`${path}/${id}`, data);
    return response.data;
};

export const createLead = async (data) => {
    const response = await api.post(`${path}`, data);
    return response.data;
};