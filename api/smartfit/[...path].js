// Vercel Serverless Proxy to SmartFit CMS API
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const pathParts = url.pathname.replace('/api/smartfit/', '');
  const targetUrl = `https://srv1309486.hstgr.cloud/api/smartfit/${pathParts}`;
  
  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    // Forward Authorization header if present
    const auth = req.headers.get('authorization');
    if (auth) {
      fetchOptions.headers['Authorization'] = auth;
    }
    
    // Forward body for POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      fetchOptions.body = await req.text();
    }
    
    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();
    
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Proxy connection failed', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
