import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE, SERVICE_COOKIE, DIRECTION_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';
import { getJourneysByNocCodeAndLineName, DirectionObject } from '../data/dynamodb';

const title = 'Select a Direction';
const description = 'Please select the route direction for your service';

type DirectionProps = {
    Operator: string;
    LineName: string;
    Journeys: DirectionObject;
};

const Direction = ({ Operator, LineName, Journeys }: DirectionProps): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/direction" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading" id="page-heading">
                                Please select your journey direction
                            </h1>
                        </legend>
                        <span className="govuk-hint" id="direction-operator-linename-hint">
                            {Operator} - {LineName}
                            {Journeys.description}
                        </span>
                        <select className="govuk-select" id="direction" name="direction" defaultValue="">
                            <option value="" disabled>
                                Select One
                            </option>
                            {Journeys.journeyPatterns.map(journey => (
                                <option key={`${journey.JourneyPatternRef}`} value={`${journey.JourneyPatternRef}`} className="journey-option">
                                    {journey.Journey}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                </div>
                <input
                    type="submit"
                    value="Continue"
                    id="continue-button"
                    className="govuk-button govuk-button--start"
                />
            </form>
        </main>
    </Layout>
);

Direction.getInitialProps = async (ctx: NextPageContext): Promise<{}> => {
    const redirectOnError = (): void => {
        if (ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/error',
            });
            ctx.res.end();
        }
    };

    deleteCookieOnServerSide(ctx, DIRECTION_COOKIE);

    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const serviceCookie = cookies[SERVICE_COOKIE];

    if (operatorCookie && serviceCookie) {
        const operatorObject = JSON.parse(operatorCookie);
        const serviceObject = JSON.parse(serviceCookie);
        let journeys: DirectionObject[] = [];

        try {
            if (ctx.req) {
                journeys = await getJourneysByNocCodeAndLineName(operatorObject.nocCode, serviceObject.lineName);
            }

            if (journeys.length === 0) {
                redirectOnError();
                return {};
            }
            return { operator: operatorObject.operator, lineName: serviceObject.lineName, journeys };
        } catch (err) {
            throw new Error(err.message);
        }
    }

    redirectOnError();

    return {};
};

export default Direction;
