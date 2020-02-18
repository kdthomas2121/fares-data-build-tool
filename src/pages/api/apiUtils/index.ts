import { NextApiRequest, NextApiResponse } from 'next';
import setCookie from 'set-cookie';
import { ServerResponse } from 'http';
import { OPERATOR_COOKIE } from '../../../constants';

type Cookies = {
    [key: string]: string;
};

export const getCookies = (req: NextApiRequest): Cookies => {
    const cookies: Cookies = {};

    if (req.headers && req.headers.cookie) {
        req.headers.cookie.split(';').forEach(cookie => {
            const parts = RegExp(/(.*?)=(.*)$/).exec(cookie);
            if (parts) {
                cookies[parts[1].trim()] = (parts[2] || '').trim();
            }
        });
    }

    return cookies;
};

export const getDomain = (req: NextApiRequest): string => {
    const host = req?.headers?.origin;
    return host ? (host as string).replace(/(^\w+:|^)\/\//, '').split(':')[0] : '';
};

export const setCookieOnResponseObject = (
    domain: string,
    cookieName: string,
    cookieValue: string,
    res: NextApiResponse,
): void => {
    setCookie(cookieName, cookieValue, {
        domain,
        path: '/',
        maxAge: 3600 * 24,
        res,
    });
};

export const getUuidFromCookie = (req: NextApiRequest): string => {
    const cookies = getCookies(req);
    const operatorCookie = unescape(decodeURI(cookies[OPERATOR_COOKIE]));
    return JSON.parse(operatorCookie).uuid;
};

export const redirectTo = (res: NextApiResponse | ServerResponse, location: string): void => {
    res.writeHead(302, {
        Location: location,
    });

    res.end();
};

export const redirectToError = (res: NextApiResponse | ServerResponse): void => {
    redirectTo(res, '/error');
};
