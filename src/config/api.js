import axios from "axios"

const BASE_URL = 'https://8f2s3z7k-5500.inc1.devtunnels.ms/api'

const profileInfoApi = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/v1/hospital-mobile/profile-info`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    } catch (error) {
        return error
    }
}

const patientList = async (token, page, limit) => {
    try {

        const response = await axios.get(`${BASE_URL}/v1/hospital-mobile/patient-list`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                page: page,
                limit: limit,
            }
        })

        return response;

    } catch (error) {
        return error
    }
}

const supportForm = async (payload, config) => {
    try {

        console.log(payload);

        const response = await axios.post(`${BASE_URL}/v1/general/ticket-raise`, payload, config)

        return response

    } catch (error) {
        return error
    }
}

export { profileInfoApi, patientList, supportForm }