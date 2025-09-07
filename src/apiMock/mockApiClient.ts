import axios from 'axios';

const MOCK_BASE_URL = 'http://localhost:3001';

const mockApiClient = axios.create({
  baseURL: MOCK_BASE_URL,
  withCredentials: false,
});

export default mockApiClient;
