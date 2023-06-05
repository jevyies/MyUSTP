import axios from '@axios';
export const useUserSignUpStore = defineStore('userSignUp', {
    actions: {
        async getPendingUsers(){
            return await axios.get('api/UserSignUp')
        },
        async getApprovedUsers(){
            return await axios.get(`api/UserSignUp/Approved`)
        },
        async approveUser(data){
            return await axios.put(`api/UserSignUp/Approve/${data}`)
        },
        async rejectUser(data){
            return await axios.put(`api/UserSignUp/Reject/${data}`)
        },
    }
})
