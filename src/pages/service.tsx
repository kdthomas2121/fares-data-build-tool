import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE, SERVICE_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';
import { getServicesByNocCode, ServiceType } from '../data/dynamodb';

const title = 'Service - Fares data build tool';
const description = 'Service selection page of the Fares data build tool';

type ServiceProps = {
    operator: string;
    services: ServiceType[];
};

const Service = ({ operator, services }: ServiceProps): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/service" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading" id="page-heading">
                                Please select your service
                            </h1>
                        </legend>
                        <span className="govuk-hint" id="service-operator-hint">
                            {operator}
                        </span>
                        <select className="govuk-select" id="service" name="service" defaultValue="">
                            <option value="" disabled>
                                Select One
                            </option>
                            {services.map(service => (
                                <option
                                    key={`${service.lineName}#${service.startDate}`}
                                    value={`${service.lineName}#${service.startDate}`}
                                    className="service-option"
                                >
                                    {service.lineName} - Start date {service.startDate}
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

export const getServerSideProps = async (ctx: NextPageContext): Promise<{}> => {
    if (!ctx.res) {
        throw new Error('Unexpected null res');
    }
    deleteCookieOnServerSide(ctx, SERVICE_COOKIE);

    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];

    if (operatorCookie) {
        const operatorObject = JSON.parse(operatorCookie);
        let services: ServiceType[] = [];

        try {
            if (ctx.req) {
                services = await getServicesByNocCode(operatorObject.nocCode);
            }

            if (services.length === 0) {
                throw new Error(`No services found for NOC Code: ${operatorObject.nocCode}`);
            }

            return { props: { operator: operatorObject.operator, services } };
        } catch (err) {
            throw new Error(err);
        }
    }

    throw new Error('Operator cookie not found');
};

export default Service;
