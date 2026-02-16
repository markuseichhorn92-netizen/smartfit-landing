// Vercel Serverless Proxy to SmartFit CMS API
export default async function handler(req, res) {
  const { path } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : path;
  const targetUrl = `https://srv1309486.hstgr.cloud/api/smartfit/${apiPath}`;
  
  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    // Forward Authorization header if present
    if (req.headers.authorization) {
      fetchOptions.headers['Authorization'] = req.headers.authorization;
    }
    
    // Forward body for POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }
    
    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();
    
    // Forward status code
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy connection failed', details: error.message });
  }
}
