import axios from 'axios'
import { getToken } from "../api/authentication";
const authURL = process.env.REACT_APP_BASE_URL + '/userDetails'


export const userDetails = async(name, email, phone, country, gender, qualification) => {
    const token = getToken();
    const res = axios.post(authURL, 
                        {"name": name, 
                        "email": email,
                        "phone": phone,
                        "country": country,
                        "gender": gender,
                        "qualification": qualification},
                        {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            }
                        }).then(response => {
        console.log(response)
        return {code: response.status, status: response.data.status, message: response.data.message}
    }).catch(e =>  {
        console.log(e)
        return []
    })
    return res
}