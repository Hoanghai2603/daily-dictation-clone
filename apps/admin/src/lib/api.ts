import axios from 'axios';

// Create a singleton cancel token source for deduplication? 
// Or better, use an AbortController.
// Actually, simple deduplication can be done with a mapping of active requests.

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

// Request interceptor to log or handle duplicates if needed.
// For now, let's keep it simple. The user issue is likely React StrictMode double-mounting.

export default api;
