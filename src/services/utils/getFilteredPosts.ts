import { defaultTo, filter, includes, some, words } from 'es-toolkit/compat';
import { lowerCase } from 'es-toolkit/string';

function getFilteredPosts(
  posts: PostListData[],
  searchQuery: string,
  category?: string,
  tag?: string
): PostListData[] {
  // Preprocess search query
  const queryKeywords = words(lowerCase(searchQuery));
  const normalizedCategory = lowerCase(defaultTo(category, ''));
  const normalizedTag = lowerCase(defaultTo(tag, ''));

  return filter(posts, (post) => {
    const { title, categories = [], tags = [] } = post.frontmatter;

    // Preprocess post fields
    const normalizedTitle = lowerCase(title);
    const normalizedAbstract = lowerCase(defaultTo(post.postAbstract, ''));
    const normalizedTags = tags.map((tag) => lowerCase(tag));
    const normalizedCategories = categories.map((category) =>
      lowerCase(category)
    );

    // Perform search query
    const matchesQuery =
      queryKeywords.length === 0 ||
      some(queryKeywords, (keyword) =>
        [
          normalizedTitle,
          normalizedAbstract,
          ...normalizedTags,
          ...normalizedCategories,
        ].some((field) => includes(field, keyword))
      );

    // Perform category and tag filtering
    const matchesCategory = normalizedCategory
      ? some(normalizedCategories, (cat) => includes(cat, normalizedCategory))
      : true;

    const matchesTag = normalizedTag
      ? some(normalizedTags, (tag) => includes(tag, normalizedTag))
      : true;

    return matchesQuery && matchesCategory && matchesTag;
  });
}

export default getFilteredPosts;
