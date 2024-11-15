'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { defaultTo, flatMap } from 'es-toolkit/compat';

import { getFilteredPosts } from '@/services/utils';

import PostListLayout from '@/components/posts/PostListLayout';
import Pagination from '@/components/posts/Pagination';
import SearchInput from '@/components/posts/SearchInput';

interface PostsClientProperties {
  posts: PostListData[];
  translation: Translation;
}

function PostsClient({ posts, translation }: PostsClientProperties) {
  const searchParameters = useSearchParams();
  const categoryParameter = defaultTo(searchParameters.get('category'), '');
  const tagParameter = defaultTo(searchParameters.get('tag'), '');
  const searchQuery = defaultTo(searchParameters.get('query'), '');

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const categories = defaultTo(
    [
      ...new Set(
        flatMap(posts, (post) =>
          defaultTo(post.frontmatter.categories, [])
        ) as string[]
      ),
    ],
    []
  );

  const tags = defaultTo(
    [
      ...new Set(
        flatMap(posts, (post) =>
          defaultTo(post.frontmatter.tags, [])
        ) as string[]
      ),
    ],
    []
  );

  // Filter posts based on search, category, and tag
  const filteredPosts = getFilteredPosts(
    posts,
    searchQuery,
    categoryParameter,
    tagParameter
  );

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className='container mx-auto flex flex-col items-center p-4'>
      {/* Centered Search Input */}
      <SearchInput
        initialValue={searchQuery}
        categories={categories}
        tags={tags}
        translation={translation}
      />

      {/* Post List */}
      <PostListLayout
        posts={currentPosts}
        translation={translation}
      />

      {/* Pagination */}
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={filteredPosts.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
}

export default PostsClient;
