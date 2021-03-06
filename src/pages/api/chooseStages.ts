import { NextApiRequest, NextApiResponse } from 'next';
import { FARE_STAGES_COOKIE } from '../../constants/index';
import { getDomain, setCookieOnResponseObject, redirectToError, redirectTo } from './apiUtils';

export const isInvalidFareStageNumber = (req: NextApiRequest): boolean => {
    const { fareStageInput } = req.body;

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(fareStageInput)) {
        return true;
    }

    if (!Number.isInteger(Number(fareStageInput))) {
        return true;
    }

    if (fareStageInput > 20 || fareStageInput < 1) {
        return true;
    }

    return false;
};

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (req.body.fareStageInput === 0) {
            redirectToError(res);
            return;
        }

        if (!req.body.fareStageInput) {
            redirectTo(res, '/chooseStages');
            return;
        }

        if (isInvalidFareStageNumber(req)) {
            redirectToError(res);
            return;
        }
        const numberOfFareStages = req.body.fareStageInput;
        const cookieValue = JSON.stringify({ fareStages: numberOfFareStages });
        setCookieOnResponseObject(getDomain(req), FARE_STAGES_COOKIE, cookieValue, req, res);
        redirectTo(res, '/stageNames');
    } catch (error) {
        redirectToError(res);
    }
};
