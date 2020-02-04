import { mockRequest, mockResponse } from 'mock-req-res';
import { OPERATOR_COOKIE, FARETYPE_COOKIE } from '../../../src/constants';
import faretype from '../../../src/pages/api/faretype';

describe('faretype', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /service when the session is valid AND a faretype cookie exists', () => {
        const writeHeadMock = jest.fn();
        const req = mockRequest({
            connection: {
                encrypted: false,
            },
            body: {},
            headers: {
                host: 'localhost:5000',
                cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D; ${FARETYPE_COOKIE}=%7B%22faretype%22%3A%22single%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D`,
            },
        });
        const res = mockResponse({
            writeHead: writeHeadMock,
        });
        faretype(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/service',
        });
    });

    it('should return 302 redirect to /service when the session is valid, there is no faretype cookie BUT one can be set', () => {
        const writeHeadMock = jest.fn();
        const req = mockRequest({
            connection: {
                encrypted: false,
            },
            body: { faretype: 'single' },
            headers: {
                host: 'localhost:5000',
                cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D`,
            },
        });
        const res = mockResponse({
            writeHead: writeHeadMock,
        });
        faretype(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/service',
        });
    });

    it('should return 302 redirect to /error when session is valid but there is neither a service cookie nor can one be set', () => {
        const writeHeadMock = jest.fn();
        const req = mockRequest({
            connection: {
                encrypted: false,
            },
            body: {},
            headers: {
                host: 'localhost:5000',
                cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D`,
            },
        });
        const res = mockResponse({
            writeHead: writeHeadMock,
        });
        faretype(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should return 302 redirect to /error when session is not valid', () => {
        const writeHeadMock = jest.fn();
        const req = mockRequest({
            connection: {
                encrypted: false,
            },
            body: {},
            headers: {
                host: 'localhost:5000',
            },
        });
        const res = mockResponse({
            writeHead: writeHeadMock,
        });
        faretype(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});