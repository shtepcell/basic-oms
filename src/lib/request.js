import axios from 'axios';

export const request = axios.create({
    baseURL: '/',
    timeout: 5000,
    responseType: 'json',
});

export const fetcher = url => request.get(url).then(({ data }) => data)
