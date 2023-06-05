import axios from '@axios';
export const useUserStore = defineStore('user', {
    actions: {
        async getAllUsers(){
            return await axios.get('api/User/All')
        },
        async getUser(data){
            return await axios.get(`api/User/${data}`)
        },
        async signUp(data){
            return await axios.post('api/User/SignUp', data)
        },
        async approveUser(data){
            return axios.post(`api/User/Approve/${data}`)
        },
        async rejectUser(data){
            return await axios.post(`api/User/Reject/${data}`)
        }
    }
})
