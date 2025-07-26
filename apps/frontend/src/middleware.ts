import {NextRequest, NextResponse} from 'next/server';
import {ApiRoutes} from "@workspace/routes/apiRoutes";

export async function middleware(req: NextRequest) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

    console.log(req);

    const token = req.cookies.get('jwt_token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}${ApiRoutes.auth.base}${ApiRoutes.auth.validateToken}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (!response.ok) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: ['/((?!login|register|api/open|_next/static|_next/image|favicon.ico).*)']
};