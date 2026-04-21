import MechanizeLayout from '@/posts/mechanize/layout.jsx';
import PadletLayout from '@/posts/padlet/layout.jsx';

/**
 * Maps post slug → layout component. Next needs static imports here so each
 * posts/[slug]/layout.jsx is bundled. Add one import + map entry per new post.
 */
const postLayouts = {
  mechanize: MechanizeLayout,
  padlet: PadletLayout,
};

export function getPostLayout(slug) {
  return postLayouts[slug] ?? null;
}
