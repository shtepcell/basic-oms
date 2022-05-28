import { request } from '../../lib/request';

export const updateDepartment = (id, { name, priorityCapacity }) => {
    return request.post(`/admin/departments/${id}`, { name, priorityCapacity });
}
