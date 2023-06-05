import axios from '@axios';
export const useUserAppRolesStore = defineStore('userapproles', {
    actions: {
        async getAppRoles(id){
            return await axios.get(`api/UserApplicationRole/UserApplication/${id}`)
        },
        async addAppRole(data){
            return await axios.post(`api/UserApplicationRole/Add`, data)
        },
    }
})
