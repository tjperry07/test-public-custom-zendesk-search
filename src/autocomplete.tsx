import type { AutocompleteSource } from '@algolia/autocomplete-js';
import { autocomplete } from '@algolia/autocomplete-js';
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
import type { Hit } from '@algolia/client-search';
import { render, h } from 'preact';
import { debounce } from 'throttle-debounce';

import { createAnimatedPlaceholderPlugin } from './aa-plugins/animatedPlaceholder';
import { createKeyboardOpenPlugin } from './aa-plugins/keyboardOpen';
import {
  AUTOCOMPLETE_PLACEHOLDERS,
  AUTOCOMPLETE_PLACEHOLDER_TEMPLATE,
  BASE_URLS,
  contentAttribute,
  SOURCES,
  titleAttribute,
} from './constants';
import {
  headerTemplate,
  instantsearchTemplate,
  NoResultsTemplate,
  FooterTemplate,
} from './templates';
import type {
  AcademyHit,
  DiscourseHit,
  DocHit,
  FederatedHits,
  HitWithAnswer,
  SourceId,
  ZendeskHit,
} from './types';
import { getSortedHits, parse } from './utils';

/**
 * @typedef {Object} StartAutocompleteReturn
 * @property {Function} destroy
 *
 * @param {(HTMLElement|string)} container
 * @returns {StartAutocompleteReturn}
 */

export const startAutocomplete = (
  container: HTMLElement
): { destroy: () => void } => {
  const answersRef: {
    current: Array<HitWithAnswer<FederatedHits> & { sourceId: SourceId }>;
  } = {
    current: [],
  };
  async function getAnswers(
    query: string,
    fn: (url: HitWithAnswer<FederatedHits>['url']) => void
  ): Promise<void> {
    try {
      const { hits } = await getSortedHits(SOURCES, query, {
        nbHits: 1,
        EXPERIMENTAL_illuminate: 1,
      });
      answersRef.current = hits.slice(0, 1);
      fn(hits[0] ? hits[0].url : '');
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      answersRef.current = [];
      fn('');
    }
  }
  const debouncedAnswers = debounce(500, getAnswers);

  const animatedPlaceholder = createAnimatedPlaceholderPlugin({
    placeholders: AUTOCOMPLETE_PLACEHOLDERS,
    placeholderTemplate: AUTOCOMPLETE_PLACEHOLDER_TEMPLATE,
  });

  const keyboardOpen = createKeyboardOpenPlugin({
    meta: true,
    key: 'KeyK',
    showKeysIndicator: true,
  });

  /* eslint-disable @typescript-eslint/consistent-type-assertions */

  const sources = [
    {
      sourceId: 'instantsearch_helpcenter',
      getItems({ query, state }) {
        const url = state.context.answerUrl as string;
        const id = url ? url.split('/').pop() : '';

        return getAlgoliaResults({
          searchClient: SOURCES.find(
            (source) => source.sourceId === 'help center'
          ).client,
          queries: [
            {
              indexName: SOURCES.find(
                (source) => source.sourceId === 'help center'
              ).indexName,
              query,
              params: {
                hitsPerPage: 4,
                distinct: true,
                filters: id ? `NOT objectID:${id}` : '',
              },
            },
          ],
          transformResponse({ hits }) {
            return hits[0].map((hit) => ({
              ...hit,

              url: hit.locale ? `/${hit.locale.locale}/articles/${hit.id}` : '',
            }));
          },
        });
      },
      getItemUrl({ item }) {
        return `${BASE_URLS['help center']}${item.url}`;
      },
      templates: {
        header() {
          return headerTemplate('help center');
        },
        item({ item, components }) {
          return instantsearchTemplate<Hit<ZendeskHit> & { url: string }>({
            item,
            components,
            highlightAttr: 'title',
            snippetAttr: 'body_safe',
            sourceId: 'help center',
          });
        },
      },
    } as AutocompleteSource<Hit<ZendeskHit> & { url: string }>,
    {
      sourceId: 'instantsearch_doc',
      getItems({ query, state }) {
        return getAlgoliaResults({
          searchClient: SOURCES.find(
            (source) => source.sourceId === 'documentation'
          ).client,
          queries: [
            {
              indexName: SOURCES.find(
                (source) => source.sourceId === 'documentation'
              ).indexName,
              query,
              params: {
                hitsPerPage: 4,
                distinct: true,
                filters: state.context.answerUrl
                  ? `NOT url:${state.context.answerUrl}`
                  : '',
              },
            },
          ],
        });
      },
      getItemUrl({ item }) {
        return `${BASE_URLS.documentation}${item.url}`;
      },
      templates: {
        header() {
          return headerTemplate('documentation');
        },
        item({ item, components }) {
          return instantsearchTemplate<Hit<DocHit>>({
            item,
            components,
            highlightAttr: 'title',
            snippetAttr: 'description',
            sourceId: 'documentation',
          });
        },
      },
    } as AutocompleteSource<Hit<DocHit>>,
    {
      sourceId: 'instantsearch_discourse',
      getItems({ query, state }) {
        return getAlgoliaResults({
          searchClient: SOURCES.find(
            (source) => source.sourceId === 'community'
          ).client,
          queries: [
            {
              indexName: SOURCES.find(
                (source) => source.sourceId === 'community'
              ).indexName,
              query,
              params: {
                hitsPerPage: 4,
                distinct: true,
                filters: state.context.answerUrl
                  ? `NOT url:${state.context.answerUrl} AND NOT topic.id:36` // topic 36 is "welcome please introduce yourself"
                  : 'NOT topic.id:36',
              },
            },
          ],
        });
      },
      getItemUrl({ item }) {
        return `${BASE_URLS.community}${item.url}`;
      },
      templates: {
        header() {
          return headerTemplate('community');
        },
        item({ item, components }) {
          return instantsearchTemplate({
            item,
            components,
            highlightAttr: ['topic', 'title'],
            snippetAttr: 'content',
            sourceId: 'community',
          });
        },
      },
    } as AutocompleteSource<Hit<DiscourseHit>>,
    {
      sourceId: 'instantsearch_academy',
      getItems({ query, state }) {
        return getAlgoliaResults({
          searchClient: SOURCES.find((source) => source.sourceId === 'academy')
            .client,
          queries: [
            {
              indexName: SOURCES.find((source) => source.sourceId === 'academy')
                .indexName,
              query,
              params: {
                hitsPerPage: 4,
                distinct: true,
                facetFilters: [['type:guide', 'type:resource']],
                filters: state.context.topHit
                  ? `NOT id:${state.context.topHit}`
                  : '',
              },
            },
          ],
          transformResponse({ hits }) {
            return hits[0].map((hit) => ({
              ...hit,
              url: `/training/${hit.id}`,
            }));
          },
        });
      },
      getItemUrl({ item }) {
        return `${BASE_URLS.academy}${item.url}`;
      },
      templates: {
        header() {
          return headerTemplate('academy');
        },
        item({ item, components }) {
          return instantsearchTemplate({
            item,
            components,
            highlightAttr: 'name',
            snippetAttr: item.content ? 'content' : 'description',
            sourceId: 'academy',
          });
        },
      },
    } as AutocompleteSource<Hit<AcademyHit> & { url: string }>,
  ];

  /* eslint-enable @typescript-eslint/consistent-type-assertions */

  const { destroy } = autocomplete({
    debug: process.env.NODE_ENV !== 'production',
    container,
    plugins: [animatedPlaceholder, keyboardOpen],
    getSources() {
      return sources;
    },
    detachedMediaQuery: '',
    openOnFocus: true,
    render({ sections, Fragment }, root) {
      render(
        <Fragment>
          <div className="aa-PanelLayout aa-Panel--scrollable stl-bg-grey-100 tw-based">
            {sections}
          </div>
          <FooterTemplate />
          <div className="aa-GradientBottom"></div>
        </Fragment>,
        root
      );
    },
    classNames: {
      item: 'DocSearch-Hit stl-bg-transparent',
      detachedCancelButton: 'aa:stl-hidden', // aa breakpoint defined in tailwind config
      source: 'stl-mb-2',
      sourceHeader: 'stl-m-0',
      detachedSearchButtonPlaceholder: 'stl-mr-2 width-205',
      input: 'stl-pl-2',
    },
    renderNoResults({ Fragment, state }, root) {
      render(
        <Fragment>
          <div className="aa-PanelLayout aa-Panel--scrollable stl-bg-grey-100 tw-based">
            <NoResultsTemplate query={state.query} />
          </div>
          <FooterTemplate />
          <div className="aa-GradientBottom"></div>
        </Fragment>,
        root
      );
    },
    onStateChange({ prevState, state, refresh, setContext }) {
      if (state.query !== prevState.query) {
        answersRef.current = [];
        debouncedAnswers(
          state.query,
          (url: HitWithAnswer<FederatedHits>['url']) => {
            setContext({ ...state.context, answerUrl: url });
            refresh();
          }
        );
      }
    },
  });

  return {
    destroy: (): void => {
      animatedPlaceholder.unsubscribe();
      destroy();
    },
  };
};
