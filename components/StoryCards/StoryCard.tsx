import classNames from 'classnames';
import { format } from 'date-fns';
import Link from 'next/link';
import { Fragment, FunctionComponent } from 'react';

import { StoryWithImage } from '@/modules/Stories';
import { getCategoryUrl } from '@/utils/prezly';

import StoryImage from './StoryImage';

import styles from './StoryCard.module.scss';

type Props = {
    story: StoryWithImage;
    size?: 'small' | 'medium' | 'big';
};

const StoryCard: FunctionComponent<Props> = ({ story, size = 'small' }) => {
    const { categories, published_at, title } = story;

    const publishedDate = format(new Date(published_at as string), 'MMMM d, y');

    const HeadingTag = size === 'small' ? 'h3' : 'h2';

    return (
        <div
            className={classNames(styles.container, {
                [styles.small]: size === 'small',
                [styles.medium]: size === 'medium',
                [styles.big]: size === 'big',
            })}
        >
            <Link href={`/${story.slug}`} passHref>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className={styles.imageWrapper}>
                    <StoryImage story={story} />
                </a>
            </Link>
            <div className={styles.content}>
                {!!categories.length && (
                    <div className={styles.categories}>
                        {categories.map((category, index) => (
                            <Fragment key={category.id}>
                                <Link href={getCategoryUrl(category)} passHref>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a className={styles.category}>{category.display_name}</a>
                                </Link>
                                {index !== categories.length - 1 && (
                                    <span className={styles.categorySeparator}>,</span>
                                )}
                            </Fragment>
                        ))}
                    </div>
                )}
                <HeadingTag className={styles.title}>
                    <Link href={`/${story.slug}`} passHref>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a className={styles.titleLink}>{title}</a>
                    </Link>
                </HeadingTag>

                <p className={styles.date}>{publishedDate}</p>
            </div>
        </div>
    );
};

export default StoryCard;
