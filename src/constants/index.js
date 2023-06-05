import CryptoJS from 'crypto-js/crypto-js';
import VueJwtDecode from 'vue-jwt-decode';
export const globalRefs = {
    CLIENT_SERVER_URL: 'http://localhost:4040/',
    SECRET_KEY: 'dwg11#^',
}
export const globalFunctions = {
    showOptions: () => {
        console.log('yes');
    },
    pageLoader: (show) => {
        if(show){
            document.getElementById('full-page-loader').classList.add('active');
        }else{
            document.getElementById('full-page-loader').classList.remove('active');
        }
    },
    convertToken(token){
        return VueJwtDecode.decode(token);
    },
    encryptData(data){
        return CryptoJS.AES.encrypt(JSON.stringify(data), globalRefs.SECRET_KEY).toString()
    },
    decryptData(data){
        var bytes  = CryptoJS.AES.decrypt(data, globalRefs.SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    },
    async wait(seconds){
        return new Promise(resolve => { setTimeout(resolve, seconds) });
    }
}
