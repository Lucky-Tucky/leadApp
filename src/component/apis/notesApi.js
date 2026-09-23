import api from '../Config/AxiosConfig';

const path = "/notes";

export const getNotes = async (lead_id) => {
    const response = await api.get(`${path}/${lead_id}`);
    return response.data;
};

export const createNote = async (lead_id, note) => {
    const response = await api.post(`${path}`, { lead_id, note });
    return response.data;
};
