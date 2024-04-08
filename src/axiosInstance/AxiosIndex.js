import axios from 'axios';

const Axios = axios.create({
  baseURL: 'http://localhost:5000/api', // Set the base URL to your backend server
});

export default Axios;