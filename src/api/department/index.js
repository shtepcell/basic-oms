import { request } from '../../lib/request';

export const updateDepartment = (id, { name, priorityCapacity }) => {
    return request.post(`/admin/departments/${id}`, { name, priorityCapacity });
}

export const addCityToDepartment = (id, cityId) => {
    return request.post(`/api/admin/department/${id}/city`, { cityId });
}

export const deleteCityFromDepartment = (id, cityId) => {
    return request.delete(`/api/admin/department/${id}/city/${cityId}`);
}
