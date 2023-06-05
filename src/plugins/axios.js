import { globalRefs } from '@/constants';
import router from '@/router';
import axios from "axios";

const axiosConfig = {
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
  refreshEndpoint: 'api/Authentication/Refresh',
  tokenType: 'Bearer'
}
var isAlreadyFetchingAccessToken = false
var subscribers = []
axios.defaults.baseURL = "https://authentication-api.ustp.edu.ph/";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.interceptors.request.use(config => {
    updateResponse(config, "request");
    const accessToken = getToken()
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(response => {
    updateResponse(response.config, "response");
    return response;
  },
  async error => {
    const { config, response } = error
    const originalRequest = config

    // if (status === 401) {
    if (response && response.status == 401) {
      console.clear();
      if (!isAlreadyFetchingAccessToken)  {
          isAlreadyFetchingAccessToken = true
          refreshToken().then(r => {
            if(r.data.error){
              return forceLogout();
            }
            isAlreadyFetchingAccessToken = false

            // Update accessToken in localStorage
            setToken(r.data.token)
            setRefreshToken(r.data.refreshToken)

            onAccessTokenFetched(r.data.token)
          })
          .catch((e) => {
            return forceLogout();
          })
      }
      const retryOriginalRequest = new Promise(resolve => {
          addSubscriber(accessToken => {
            originalRequest.headers.Authorization = `${axiosConfig.tokenType} ${accessToken}`
            resolve(axios(originalRequest))
          })
      })
      return retryOriginalRequest
    }
    updateResponse(config, "response");
    return Promise.reject(error);
  }
);

const localServerConfig = {
  baseURL: globalRefs.CLIENT_SERVER_URL,
  header: {
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
  },
};

function updateResponse({ method }, type) {
  if (
    method.toLowerCase() === "post" ||
    method.toLowerCase() === "put" ||
    method.toLowerCase() === "delete"
  ) {
    if (type === "request") {
      document.getElementById("full-page-loader").classList.add("active");
    }else{
      document.getElementById("full-page-loader").classList.remove("active");
    }
  }
}
function onAccessTokenFetched(accessToken) {
  subscribers = subscribers.filter(callback => callback(accessToken))
}

function addSubscriber(callback) {
  subscribers.push(callback)
}

function getToken() {
  return localStorage.getItem(axiosConfig.storageTokenKeyName)
}

function getRefreshToken() {
  return localStorage.getItem(axiosConfig.storageRefreshTokenKeyName)
}

function setToken(value) {
  localStorage.setItem(axiosConfig.storageTokenKeyName, value)
}

function setRefreshToken(value) {
  localStorage.setItem(axiosConfig.storageRefreshTokenKeyName, value)
}
function refreshToken() {
  return axios.post(axiosConfig.refreshEndpoint, {
      refreshToken: getRefreshToken(),
      token: getToken()
  })
}
function forceLogout(){
  localStorage.removeItem(axiosConfig.storageTokenKeyName)
  localStorage.removeItem(axiosConfig.storageRefreshTokenKeyName)

  // Remove userData from localStorage
  localStorage.removeItem('userData')

  // Redirect to login page
  router.push({ name: 'login', query: { to: router.options.history.state.current } })
}

export default axios;
export const localApi = axios.create({
  ...localServerConfig,
  baseURL: localServerConfig.baseURL,
});
