import React from 'react';
import { NextPage } from 'next';
import Layout from '../layout/Layout';

const title = 'Input Method - Fares data build tool';
const description = 'Input method selection page of the Fares data build tool';

const InputMethod: NextPage = () => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/inputMethod" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="input-method-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 id="input-method-heading" className="govuk-fieldset__heading">
                                Please select your preferred input method
                            </h1>
                        </legend>
                        <div className="govuk-radios">
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="csv-upload"
                                    name="inputMethod"
                                    type="radio"
                                    value="csv"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="csv-upload">
                                    Upload (.csv)
                                </label>
                            </div>
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="manual-entry"
                                    name="inputMethod"
                                    type="radio"
                                    value="manual"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="manual-entry">
                                    Manual Fares Triangle input
                                </label>
                            </div>
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="interactive-map"
                                    name="inputMethod"
                                    type="radio"
                                    value="interactiveMap"
                                    disabled
                                    aria-disabled="true"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="interactive-map">
                                    Interactive Map (Beta)
                                </label>
                            </div>
                        </div>
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

export default InputMethod;
