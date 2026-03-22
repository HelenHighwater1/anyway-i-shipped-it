import Image from 'next/image';
import { SITE_TITLE, SITE_TAGLINE } from '@/lib/site';
import SketchPanel from '@/components/ui/SketchPanel';
import BlogNav from '@/components/ui/BlogNav';
import ApplicationWorkflowSvg from '@/components/flowchart/ApplicationWorkflowSvg';
import PostCard from '@/components/post/PostCard';
import { PLACEHOLDER_POSTS } from '@/data/placeholderPosts';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.pageWrapper}>
      <header className={`${styles.header} animateFadeIn`}>
        <div className={styles.titleRow}>
          <h1 className={styles.siteTitle}>{SITE_TITLE}</h1>
          <Image
            src="/shrug.png"
            alt=""
            width={936}
            height={254}
            className={styles.titleShrug}
            priority
          />
        </div>
        <p className={styles.tagline}>{SITE_TAGLINE}</p>
      </header>

      <BlogNav />

      <SketchPanel className={`${styles.sketchPanel} ${styles.introSketchPanel}`}>
        <section
          className={`${styles.introSection} animateFadeIn`}
          aria-labelledby="intro-heading"
        >
          <div className={styles.panelTextBuffer}>
            <h2 id="intro-heading" className={styles.introHeading}>
              Intro:
            </h2>
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
        </section>
      </SketchPanel>

      <SketchPanel className={`${styles.sketchPanel} ${styles.recentPostsSketchPanel}`}>
        <section
          className={`${styles.postsSection} animateFadeIn`}
          aria-labelledby="posts-heading"
        >
          <div className={styles.panelTextBuffer}>
            <h2 id="posts-heading" className={styles.postsHeading}>
              Recent Posts
            </h2>
            <div className={styles.postGrid}>
              {PLACEHOLDER_POSTS.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      </SketchPanel>
    </div>
  );
}
