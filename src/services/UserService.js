import axios from 'axios'

//const ax = axios.create({baseURL: `http://localhost:8081/`})
const ax = axios.create({baseURL: `http://pcknot5.fit.vutbr.cz:42024/`})



export default {
  login (user_data) {
    return ax.post('login/', user_data)
    }
}
