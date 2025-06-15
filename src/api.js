// Log the environment variable value
console.log('API_URL from env:', process.env.API_URL);

export const API_BASE_URL = 'https://cms-magzine-1.onrender.com';

console.log('Using API_BASE_URL:', API_BASE_URL);

export const API = {
    BASE_URL: API_BASE_URL,
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    issues: `${API_BASE_URL}/api/issues`,
    articles: `${API_BASE_URL}/api/articles`,
    article: (id) => `${API_BASE_URL}/api/articles/${id}`,
    issue: (id) => `${API_BASE_URL}/api/issues/${id}`,
    issueArticles: (id) => `${API_BASE_URL}/api/issues/${id}/articles`
};

export const authHeader = (token, isMultipart = false) => ({
    'Authorization': `Bearer ${token}`,
    ...(!isMultipart && { 'Content-Type': 'application/json' })
});

// Helper function to handle API responses
export const handleApiResponse = async (response) => {
    if (!response.ok) {
        const text = await response.text();
        let error;
        try {
            const json = JSON.parse(text);
            error = json.message || json.msg || 'API request failed';
        } catch {
            error = text || `HTTP error! status: ${response.status}`;
        }
        throw new Error(error);
    }
    return response.json();
};
