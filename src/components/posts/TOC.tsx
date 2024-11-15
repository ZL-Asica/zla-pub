'use client';

import { FaListUl } from 'react-icons/fa';

import { useTOCLogic, useVisibilityOnScroll } from '@/hooks';

import TOCLink from '@/components/helpers/TOCLink';

interface TOCProperties {
  items: TocItems[];
  translation: Translation;
  showThumbnail?: boolean;
}

const TOC = ({ items, translation, showThumbnail = true }: TOCProperties) => {
  const { activeSlug, isOpen, handleToggle, handleLinkClick, tocReference } =
    useTOCLogic();
  const { isVisible } = useVisibilityOnScroll(showThumbnail ? undefined : 0);

  return (
    <div
      className={`${isVisible ? 'opacity-100' : 'opacity-0'} duration-200 ease-in-out`}
    >
      <button
        hidden={!isVisible}
        aria-hidden={!isVisible}
        onClick={handleToggle}
        aria-label='Toggle Table of Contents'
        className={`fixed bottom-28 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--sakuraPink)] p-3 text-white shadow-lg transition-transform md:right-16 lg:right-20 xl:hidden ${
          isOpen ? 'translate-y-2' : 'hover:scale-110'
        }`}
      >
        <FaListUl size={20} />
      </button>
      <nav
        ref={tocReference}
        hidden={!isVisible}
        aria-hidden={!isVisible}
        className={`fixed bottom-40 top-auto z-40 max-h-[60vh] w-auto max-w-56 overflow-auto rounded-lg bg-[var(--lightGray)] p-3 shadow-md transition-all xl:bottom-auto xl:top-36 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } right-8 xl:right-[calc((100vw-1280px)/2+10px)] xl:block xl:translate-x-0 ${!isOpen && 'hidden xl:block'} scrollbar-custom text-wrap break-words`}
      >
        <h2 className='mb-4 text-lg font-semibold text-[var(--sakuraPink)]'>
          {translation.post.toc}
        </h2>
        {items.map((item) => (
          <TOCLink
            key={item.slug}
            item={item}
            activeSlug={activeSlug}
            handleLinkClick={handleLinkClick}
          />
        ))}
      </nav>
    </div>
  );
};

export default TOC;
