import SketchPanel from '@/components/ui/SketchPanel';
import PostCard from '@/components/post/PostCard';
import { getSortedPostsMeta } from '@/lib/posts';
import { SITE_TITLE } from '@/lib/site';
import sitePage from '../sitePage.module.css';
import styles from './page.module.css';

export const metadata = {
  title: `All posts - ${SITE_TITLE}`,
  description: `Archive of posts from ${SITE_TITLE}.`,
};

export default function PostsIndexPage() {
  const posts = getSortedPostsMeta();

  return (
    <div className={styles.pageWrapper}>
      <h1 className={`${sitePage.pageTitle} animateFadeIn`}>All posts</h1>

      <SketchPanel className={`${styles.sketchPanel} animateFadeIn`}>
        <section className={styles.postsSection} aria-labelledby="archive-heading">
          <div className={styles.panelTextBuffer}>
            <h2 id="archive-heading" className={styles.postsHeading}>
              Archive
            </h2>
            {posts.length === 0 ? (
              <p className={styles.empty}>No published posts yet.</p>
            ) : (
              <div className={styles.postGrid}>
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      </SketchPanel>
    </div>
  );
}
