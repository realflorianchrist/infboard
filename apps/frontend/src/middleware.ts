import {NextRequest, NextResponse} from 'next/server';
import {ApiRoutes} from "@workspace/routes";
import routes from "@/src/constants/routes";
import {TOKEN_KEY} from "@workspace/constants";

export async function middleware(req: NextRequest) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

    const token = req.cookies.get(TOKEN_KEY)?.value;

    if (!token) {
        return NextResponse.redirect(new URL(routes.LOGIN, req.url));
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
            return NextResponse.redirect(new URL(routes.LOGIN, req.url));
        }

        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL(routes.LOGIN, req.url));
    }
}

export const config = {
    matcher: ['/((?!auth|api/open|_next/static|_next/image|favicon.ico).*)']
};