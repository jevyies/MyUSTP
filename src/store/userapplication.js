import axios from '@axios';
export const useUserApplicationStore = defineStore('userapplication', {
    actions: {
        async getMyApps(){
            return await axios.get('api/UserApplication/My')
        },
        async getUserApps(userId){
            return await axios.get(`api/UserApplication/User/${userId}`)
        },
        async addUserApps(userId, data){
            return await axios.post(`api/UserApplication/Add/${userId}`, data)
        },
        async removeUserApp(id){
            return await axios.delete(`api/UserApplication/Remove/${id}`)
        }
    }
})
