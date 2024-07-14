/*
    Taken from https://benjamin-chavez.com/blog/integrating-next.js-with-express.js-using-auth0-for-authentication
    Used on the serverside to get the user's access token so that the REST API can be protected
    with Auth0.
    User's requests are routed through the middleware and the access token of the user is added to a request header
    before being sent to the backend
*/

import { getAccessToken, withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';
import { NextRequest, NextResponse } from 'next/server';

export default withMiddlewareAuthRequired(async function middleware(req) {
// If we are accessing the AUTH api path, we don't need to use middleware
if (req.nextUrl.pathname.startsWith('/api/auth')) {
    return;
}

const response = NextResponse.next({
    request: {
    headers: new Headers(req.headers),
    },
});

const { accessToken } = await getAccessToken();

response.headers.set('Authorization', `Bearer ${accessToken}`);

return response;
});

export const config = {
    matcher: ['/api/:path*'],
    maxDuration: 300
};