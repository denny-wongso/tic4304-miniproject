import axios from 'axios'
const authURL = process.env.REACT_APP_BASE_URL + '/login'


export const login = async(email, password) => {
    const res = axios.post(authURL, {"email": email, "password": password}).then(response => {
        if(response.status == 200 && response.data.status == true) {
            setToken(response.data.token)
        }
        return {code: response.status, status: response.data.status}
    }).catch(e =>  {
        console.log(e)
        return []
    })
    return res
}

export const getToken = () => {
    return localStorage.getItem('accessToken')
}

export const setToken = (token) => {
    localStorage.setItem('accessToken', token)
}