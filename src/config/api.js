import axios from "axios"

const BASE_URL = 'https://8f2s3z7k-5500.inc1.devtunnels.ms/api'
// const BASE_URL = 'https://api.medscred.com/api'

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

        const response = await axios.post(`${BASE_URL}/v1/general/ticket-raise`, payload, config)

        return response

    } catch (error) {
        return error
    }
}

const hospitalAccountType = async (token) => {
    try {

        const response = await axios.get(`${BASE_URL}/v1/hospitals/account-types`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data.data
    } catch (error) {
        return error
    }
}

const caseList = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/v1/hospital-mobile/case-list`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })

        return response.data;

    } catch (error) {
        return error
    }
}

const dischargeDataUpdate = async (token, payload) => {
    try {

        const response = await axios.post(`${BASE_URL}/v1/hospital-mobile/discharge`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
        })

        return response

    } catch (error) {
        console.log(error);

    }
}

const getDischargeDetail = async (token, caseId) => {
    try {
        const response = await axios.get(`${BASE_URL}/v1/hospital-mobile/discharge/${caseId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    } catch (error) {
        console.log(error);
    }
}

const emiDetails = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/v1/general/emi-plans`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response

    } catch (error) {
        return error
    }
}

export { profileInfoApi, patientList, supportForm, hospitalAccountType, caseList, dischargeDataUpdate, getDischargeDetail, emiDetails }