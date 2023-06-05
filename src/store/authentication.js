import axios from '@axios';
export const useAuthenticationStore = defineStore('authentication', {
    actions: {
        async login(data) {
            return await axios.post('api/Authentication/login', data)
        }
    }
})
