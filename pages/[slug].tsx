import type { ExtendedStory } from '@prezly/sdk';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';

import { NewsroomContextProvider } from '@/contexts/newsroom';
import { DUMMY_DEFAULT_LOCALE, importMessages } from '@/utils';
import { getPrezlyApi } from '@/utils/prezly';
import { BasePageProps, Translations } from 'types';

const Story = dynamic(() => import('@/modules/Story'), { ssr: true });

interface Props extends BasePageProps {
    story: ExtendedStory;
    translations: Translations;
}

const StoryPage: NextPage<Props> = ({
    story,
    categories,
    newsroom,
    companyInformation,
    languages,
    localeCode,
    translations,
    themePreset,
    algoliaSettings,
}) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
        languages={languages}
        localeCode={localeCode}
        selectedStory={story}
        translations={translations}
        themePreset={themePreset}
        algoliaSettings={algoliaSettings}
    >
        <Story story={story} />
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { req: request, locale } = context;
    const api = getPrezlyApi(request);
    const { slug } = context.params as { slug?: string };
    const story = slug ? await api.getStoryBySlug(slug) : null;

    if (!story) {
        return { notFound: true };
    }

    const basePageProps = await api.getBasePageProps(request, locale, story);

    if (!basePageProps.localeResolved) {
        return { notFound: true };
    }

    if (locale && locale !== DUMMY_DEFAULT_LOCALE) {
        return {
            redirect: {
                destination: `/${slug}`,
                permanent: true,
            },
        };
    }

    const translations = await importMessages(basePageProps.localeCode);

    return {
        props: {
            ...basePageProps,
            story,
            translations,
        },
    };
};

export default StoryPage;
