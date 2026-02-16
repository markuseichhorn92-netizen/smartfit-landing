const BACKEND_URL = 'https://srv1309486.hstgr.cloud/api/smartfit';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : (path || '');
  const targetUrl = `${BACKEND_URL}/${apiPath}`;
  
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    const opts = { method: req.method, headers };
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      opts.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, opts);
    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy failed', message: error.message });
  }
}
