import axios from 'axios';

const client = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export default client;
