import SketchPanel from '@/components/ui/SketchPanel';
import ApplicationWorkflowSvg from '@/components/flowchart/ApplicationWorkflowSvg';
import PostCard from '@/components/post/PostCard';
import { getSortedPostsMeta } from '@/lib/posts';
import sitePage from '../sitePage.module.css';
import styles from './page.module.css';

const RECENT_POST_LIMIT = 6;

export default function HomePage() {
  const recentPosts = getSortedPostsMeta().slice(0, RECENT_POST_LIMIT);

  return (
    <div className={styles.pageWrapper}>
      <section
        className={styles.introBlock}
        aria-labelledby="intro-heading"
      >
        <h1 id="intro-heading" className={`${sitePage.pageTitle} animateFadeIn`}>
          Intro
        </h1>

        <SketchPanel
          className={`${styles.sketchPanel} ${styles.introSketchPanel} animateFadeIn`}
        >
          <div className={styles.introSection}>
            <div className={styles.panelTextBuffer}>
              <p className={styles.body}>
                This will be a series of blog posts about my desperate attempts to stand
                out as a junior, bootcamp-grad/career changer engineer in the rapidly
                shifting world of tech layoffs, an AI boom, and a f*ck ton of
                uncertainty.
              </p>
              <p className={styles.body}>
                I think at this point, most people can relate to (or at least know of)
                the slog that is the job market today. My routine is as follows:
              </p>
            </div>
            <div className={styles.flowchartSlot}>
              <ApplicationWorkflowSvg />
            </div>
            <div className={styles.panelTextBuffer}>
              <p className={styles.body}>
                Yup - it is brutal. After hundreds (...thousands?) of those, I am over
                it. But I also don&apos;t give up. So - this is the story about how I
                shifted my strategy to be more engaged, focus on the things that
                interest me most, and learn along the way - about industries,
                technologies, and AI uses. It wasn&apos;t an intentional change, but man
                is it a lot more fun.
              </p>
            </div>
          </div>
        </SketchPanel>
      </section>

      <SketchPanel
        fitContent
        className={`${styles.sketchPanel} ${styles.recentPostsSketchPanel}`}
      >
        <section
          className={`${styles.postsSection} animateFadeIn`}
          aria-labelledby="posts-heading"
        >
          <div className={styles.panelTextBuffer}>
            <h2 id="posts-heading" className={styles.postsHeading}>
              Recent Posts
            </h2>
            <div className={styles.postGrid}>
              {recentPosts.length === 0 ? (
                <p className={styles.body}>
                  No published posts yet - add one under <code>posts/</code> with{' '}
                  <code>published: true</code> in <code>meta.json</code>.
                </p>
              ) : (
                recentPosts.map((post) => (
                  <PostCard key={post.slug} post={post} variant="row" />
                ))
              )}
            </div>
          </div>
        </section>
      </SketchPanel>
    </div>
  );
}
