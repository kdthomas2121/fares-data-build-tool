import { mockRequest, mockResponse } from 'mock-req-res';
import http from 'http';
import direction from '../../../src/pages/api/direction';
import { OPERATOR_COOKIE } from '../../../src/constants';

http.OutgoingMessage.prototype.setHeader = jest.fn();

describe('direction', () => {
    const mockOperatorCookie = `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D`;
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /direction (i.e. itself) when the session is valid, but there is no request body', () => {
        const writeHeadMock = jest.fn();
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: {},
            headers: {
                host: 'localhost:5000',
                cookie: mockOperatorCookie,
            },
        });
        const res = mockResponse({
            writeHead: writeHeadMock,
        });
        direction(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/direction',
        });
    });

    it('should return 302 redirect to /inputMethod when session is valid and request body is present', () => {
        const writeHeadMock = jest.fn();
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: { journeyPattern: 'test_journey' },
            headers: {
                host: 'localhost:5000',
                cookie: mockOperatorCookie,
            },
        });
        const res = mockResponse({
            writeHead: writeHeadMock,
        });
        direction(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/inputMethod',
        });
    });

    it('should return 302 redirect to /error when session is not valid', () => {
        const writeHeadMock = jest.fn();
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: {},
            headers: {
                host: 'localhost:5000',
            },
        });
        const res = mockResponse({
            writeHead: writeHeadMock,
        });
        direction(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});