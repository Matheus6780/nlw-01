import axios from 'axios'

const api = axios.create({
    // ou o endereço do expo (ex: 192.168.100.13:19000), ou o da api rest, não sei qual
    baseURL: 'http://192.168.100.13:5000'
})

export default api