import type { NewsroomGallery } from '@prezly/sdk';
import { getAssetsUrl, getUploadcareGroupUrl } from '@prezly/theme-kit-nextjs';
import { useEffect, useState } from 'react';

import { SlateRenderer } from '@/components';
import StoryLinks from '@/components/StoryLinks';

import Layout from '../Layout';

import DownloadLink from './DownloadLink';

import styles from './Gallery.module.scss';

interface Props {
    gallery: NewsroomGallery;
}

function Gallery({ gallery }: Props) {
    const { content, images, title, uploadcare_group_uuid } = gallery;

    const [url, setUrl] = useState('');

    useEffect(() => {
        if (typeof window !== undefined) {
            setUrl(window.location.href);
        }
    }, []);

    return (
        <Layout title={title} imageUrl={getAssetsUrl(images[0].uploadcare_image.uuid)}>
            <div className={styles.container}>
                <h1 className={styles.title}>{title}</h1>

                <div className={styles.links}>
                    {uploadcare_group_uuid && (
                        <DownloadLink href={getUploadcareGroupUrl(uploadcare_group_uuid, title)} />
                    )}
                    <StoryLinks url={url} className={styles.shareLinks} />
                </div>

                <SlateRenderer nodes={JSON.parse(content)} />
            </div>
        </Layout>
    );
}

export default Gallery;
