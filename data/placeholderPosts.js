/**
 * Temporary hardcoded posts for landing layout tests.
 * Shape matches BLOG_STANDARDS.md meta.json — swap for getSortedPostsMeta() later.
 * Thumbnail uses public SVG until a real post asset exists (same dimensions as workflow SVG).
 */
export const PLACEHOLDER_POSTS = [
  {
    slug: 'example-post',
    title: 'Example Post Title',
    date: '2026-03-01',
    summary:
      'One line placeholder summary — swap when real posts ship.',
    thumbnail: '/application-workflow.svg',
    url: 'https://anyway-i-shipped-it.com/posts/example-post',
  },
];
