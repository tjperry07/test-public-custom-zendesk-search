import algoliasearch from 'algoliasearch/lite';

import type { Source, SourceId } from './types';

export const SEARCH_INPUT_SELECTOR: string = '#query';
export const REQUEST_INPUT_SELECTOR: string = '#request_subject';

export const AUTOCOMPLETE_PLACEHOLDERS: string[] = [
  'articles',
  'docs',
  'community posts',
  'academy content',
];

export const AUTOCOMPLETE_PLACEHOLDER_TEMPLATE = (
  placeholder: string
): string => `Search for ${placeholder}`;

export const SOURCES: Source[] = [
  // {
  //   sourceId: 'community',
  //   // indexName: 'YOUR_INDEX_NAME_HERE',
  //   // client: algoliasearch('YOUR_APP_ID_HERE', 'YOUR_APP_SEARCH_KEY_HERE'),
  //   answerParams: {
  //     attributesForPrediction: ['content'],
  //   },
  //   searchUrl: 'YOUR SEARCH URL HERE',
  // },
  {
    sourceId: 'documentation',
      indexName: 'Doc Search Test',
      client: algoliasearch('4SWYKD9R8D', '2f8b2415d8e2064f58ba6a210d375205'),
      searchUrl: 'https://deploy-preview-16--coalesce-dev-docs-mvp.netlify.app',
      searchParams:{
        attributesToHighlight: ['title'],
        attributesToSnippet: ['description']
      }

  },
  {
    sourceId: 'help center',
      indexName: 'Zendesk',
      client: algoliasearch('4SWYKD9R8D', '2f8b2415d8e2064f58ba6a210d375205'),
      searchUrl: 'https://coalescesoftwareinc.zendesk.com/hc/en-us',
      searchParams:{
        attributesToHighlight: ['title'],
        attributesToSnippet: ['description']
      }

  }
  // {
  //   sourceId: 'academy',
  //    //  indexName: 'YOUR_INDEX_NAME_HERE',
  //   //client: algoliasearch('YOUR_APP_ID_HERE', 'YOUR_APP_SEARCH_KEY_HERE'),
  //   searchParams: {
  //     facetFilters: [['type:guide', 'type:resource']],
  //   },
  //   answerParams: {
  //     attributesForPrediction: ['name', 'content', 'description'],
  //   },
  //     searchUrl: 'YOUR SEARCH URL HERE',
  // },
];

export const titleAttribute = (item): string | string[] => {
  switch (item.sourceId) {
    case 'academy':
      return 'name';
    case 'community':
      return ['topic', 'title'];
    default:
      return 'title';
  }
};

export const contentAttribute = (
  item
): 'content' | 'description' | 'body_safe' => {
  switch (item.sourceId) {
    case 'academy':
      return item.content ? 'content' : 'description';
    case 'community':
      return 'content';
    case 'help center':
      return 'body_safe';
    case 'documentation':
      return 'description';
    default:
      return 'content';
  }
};

export const BASE_URLS: Record<SourceId, string> = {
  community: 'https://discourse.algolia.com',
  documentation: '',
  'help center': 'https://coalescesoftwareinc.zendesk.com/hc',
  academy: 'https://academy.algolia.com',
};

const basePath = {
  development: '/',
  demo: '/custom-zendesk-search/',
  production: '/',
};

// eslint-disable-next-line no-warning-comments
export const PATHNAMES =
  process.env.NODE_ENV === 'production'
    ? {
        search: `${basePath.production}hc/en-us`,
        form: `${basePath.production}hc/en-us/requests/new`,
      }
    : {
        search: basePath[process.env.NODE_ENV],
        form: basePath[process.env.NODE_ENV],
      };
