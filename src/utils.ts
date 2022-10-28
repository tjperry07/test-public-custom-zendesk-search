import type { FindAnswersOptions } from '@algolia/client-search';

import { customFindAnswers } from './answers';
import type { FederatedHits, HitWithAnswer, Source, SourceId } from './types';

export const getContainerAndButton = (
  inputSelector: string
): [HTMLElement, HTMLElement] => {
  // figure out parent container of the input
  const allInputs: NodeListOf<HTMLInputElement> =
    document.querySelectorAll(inputSelector);
  if (allInputs.length === 0) {
    throw new Error(
      `Couldn't find input matching inputSelector '${inputSelector}'.`
    );
  }
  if (allInputs.length > 1) {
    throw new Error(
      `Too many inputs (${allInputs.length}) matching inputSelector '${inputSelector}'.`
    );
  }
  let form: HTMLElement = allInputs[0];
  while (form && form.tagName !== 'FORM') {
    form = form.parentElement;
  }
  if (!form) {
    throw new Error(
      `Couldn't find the form container of inputSelector '${inputSelector}'`
    );
  }
  const container: HTMLElement = document.createElement('div');
  container.style.position = 'relative';
  form.parentNode.replaceChild(container, form);

  const submitButton: HTMLElement = form.querySelector('input[type="submit"]');
  return [container, submitButton];
};

export const getElement = <TElement extends Element>(
  selector: string
): TElement => {
  const allElements: NodeListOf<TElement> = document.querySelectorAll(selector);
  if (allElements.length === 0) {
    throw new Error(
      `Couldn't find any element matching selector '${selector}'.`
    );
  }
  if (allElements.length > 1) {
    throw new Error(
      `Too many elements (${allElements.length}) matching selector '${selector}'.`
    );
  }

  return allElements[0];
};

function debouncePromise<TParams, TResponse>(
  fn: (...params: TParams[]) => Promise<TResponse>,
  time: number
): (p: TParams) => Promise<TResponse> {
  let timerId: ReturnType<typeof setTimeout> | undefined = undefined;

  return function debounced(...args: TParams[]): Promise<TResponse> {
    if (timerId) {
      clearTimeout(timerId);
    }

    return new Promise<TResponse>((resolve) => {
      timerId = setTimeout(() => resolve(fn(...args)), time);
    });
  };
}

export const debounced = <TParams>(params: TParams): Promise<TParams> =>
  debouncePromise<TParams, TParams>(
    (items) => Promise.resolve(items),
    300
  )(params);

export const getSortedHits = async (
  SOURCES: Source[],
  query: string,
  genericAnswerParams: Omit<FindAnswersOptions, 'attributesForPrediction'> & {
    EXPERIMENTAL_illuminate?: number;
  } = {}
): Promise<{
  hits: Array<HitWithAnswer<FederatedHits> & { sourceId: SourceId }>;

}> => {
  const hits = await Promise.all(
    SOURCES.map((source) =>
      customFindAnswers({
        query,
        index: source.client.initIndex(source.indexName),

        sourceId: source.sourceId,
        searchParams: source.searchParams,
      })
    )
  );


  const fixedHits = hits.map(fixhits);
  function fixhits(hitset){
    return hitset.map(function(hit){
      if (hit.sourceId=="community"){

        return hit;
      }
      return hit;
    })
  }

  const flattenHits = fixedHits.flat();

  if (flattenHits.length) {
    return { hits: flattenHits };
  }
  return { hits: [] };
};

export const parse = (html: string, selector: string): HTMLElement => {
  const el = document.createElement('html');
  el.innerHTML = html;
  return el.querySelector(selector);
};

export const capitalizeFirst = (text: string): string =>
  `${text[0].toUpperCase()}${text.substr(1)}`;

export interface GroupedArrayObject<T> {
  title: string;
  items: T[];
}

export const groupBy = <
  T extends Record<string, string | any>,
  K extends keyof T
>(
  array: T[],
  groupKey: K
): Array<GroupedArrayObject<T>> =>
  array.reduce<Array<GroupedArrayObject<T>>>((prev, next) => {
    const groupIndex = prev.findIndex(
      (group) => group.title === next[groupKey]
    );
    if (groupIndex > -1) {
      const group = prev[groupIndex];
      const newPrev = prev;
      newPrev[groupIndex] = {
        title: group.title,
        items: [...group.items, next],
      };
      return [...newPrev];
    }
    return [...prev, { title: next[groupKey], items: [next] }];
  }, []);
