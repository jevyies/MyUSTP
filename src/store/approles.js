import axios from '@axios';

export const useAppRoleStore = defineStore('approles', {
    actions: {
        async getAppRoles(id){
            return await axios.get(`api/ApplicationRole/Application/${id}`)
        },
        async createAppRole(data){
            return await axios.post(`api/ApplicationRole/Application/${data.applicationId}`, data)
        },
        async updateAppRole(data){
            return await axios.put(`api/ApplicationRole/${data.id}`, data)
        },
        async deleteAppRole(id){
            return await axios.delete(`api/ApplicationRole/${id}`)
        }
    }
})
