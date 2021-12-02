import { Newsroom, Story, TrackingPolicy } from '@prezly/sdk';
import Head from 'next/head';
import Script from 'next/script';
import React, { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';

import {
    createAnalyticsStub,
    getAnalyticsJsUrl,
    getConsentCookie,
    isPrezlyTrackingAllowed,
    setConsentCookie,
} from './lib';

interface Context {
    consent: boolean | null;
    isAnalyticsReady: boolean;
    isTrackingAllowed: boolean | null;
    newsroom: Newsroom;
    setConsent: (consent: boolean) => void;
    trackingPolicy: TrackingPolicy;
}

interface Props {
    newsroom: Newsroom;
    story: Story | undefined;
}

export const AnalyticsContext = createContext<Context | undefined>(undefined);

export const useAnalyticsContext = () => {
    const analyticsContext = useContext(AnalyticsContext);
    if (!analyticsContext) {
        throw new Error('No `AnalyticsContextProvider` found when calling `useAnalyticsContext`');
    }

    return analyticsContext;
};

export const AnalyticsContextProvider: FunctionComponent<Props> = ({
    children,
    newsroom,
    story,
}) => {
    const { uuid, tracking_policy: trackingPolicy } = newsroom;
    const [isAnalyticsReady, setAnalyticsReady] = useState(false);
    const [consent, setConsent] = useState(getConsentCookie());

    useEffect(() => {
        if (trackingPolicy === TrackingPolicy.DISABLED) {
            window.analytics = createAnalyticsStub();
        }
    });

    useEffect(() => {
        if (typeof consent === 'boolean') {
            setConsentCookie(consent);
        }
    }, [consent]);

    return (
        <AnalyticsContext.Provider
            value={{
                consent,
                isAnalyticsReady,
                isTrackingAllowed: isPrezlyTrackingAllowed(consent, newsroom),
                newsroom,
                setConsent,
                trackingPolicy: newsroom.tracking_policy,
            }}
        >
            <Head>
                <meta name="prezly:newsroom" content={newsroom.uuid} />
                {story && <meta name="prezly:story" content={story.uuid} />}
                {newsroom.tracking_policy !== TrackingPolicy.DEFAULT && (
                    <meta name="prezly:tracking_policy" content={newsroom.tracking_policy} />
                )}
            </Head>
            {trackingPolicy !== TrackingPolicy.DISABLED && (
                <Script
                    key="prezly-analytics"
                    onLoad={() => setAnalyticsReady(true)}
                    src={getAnalyticsJsUrl(uuid)}
                />
            )}
            {children}
        </AnalyticsContext.Provider>
    );
};