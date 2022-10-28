import type { BaseItem } from '@algolia/autocomplete-core';
import type { AutocompletePlugin } from '@algolia/autocomplete-js';

/**
 *
 * @param {boolean} meta - Choose if the 'Ctrl' or 'Cmd' key should be used.
 * @param {string} key - The key you want to use to open the autocomplete: can be in keyboard code form or not ('KeyM' or 'M').
 * @param {boolean} showKeysIndicator - Choose if you want keys indicator to display next to the placeholder.
 */

export function createKeyboardOpenPlugin<TItem extends BaseItem, TData>({
  meta,
  key,
  showKeysIndicator,
}: {
  meta: boolean;
  key: KeyboardEvent['code'];
  showKeysIndicator: boolean;
}): AutocompletePlugin<TItem, TData> {
  return {
    subscribe({ setIsOpen }): void {
      const keyCode = `Key${key.replace('Key', '')}`;
      const interval = setInterval(() => {
        const detachedButton = document.querySelector<HTMLButtonElement>(
          '.aa-DetachedSearchButton'
        );

        if (detachedButton && showKeysIndicator) {
          clearInterval(interval);
          detachedButton.dataset.key = keyCode.replace('Key', '');
          detachedButton.classList.add(
            'keyboard-shortcut',
            isAppleDevice() ? 'keyboard-shortcut--mac' : null,
            !meta ? 'no-meta' : null
          );
        }
      }, 10);

      document.addEventListener('keydown', (e) => {
        const condition = e.code === keyCode;

        if (meta) {
          if (condition && (e.ctrlKey || e.metaKey)) {
            setIsOpen(true);
          }
        } else if (condition) {
          setIsOpen(true);
        }
      });
    },
  };
}

function isAppleDevice(): boolean {
  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}
