import axios from '@axios';

export const useAppStore = defineStore('app', {
    actions: {
        async getAllApps(){
            return await axios.get('api/Application/All')
        },
        async getApp(data){
            return await axios.get(`api/Application/${data}`)
        },
        async createApp(data){
            return await axios.post('api/Application', data)
        },
        async updateApp(data){
            return await axios.put(`api/Application/${data.id}`, data)
        },
        async deleteApp(data){
            return await axios.delete(`api/Application/${data}`)
        }
    }
})
