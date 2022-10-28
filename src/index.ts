import '@algolia/autocomplete-theme-classic';
import '@docsearch/css';
import './css/custom.scss';
import './css/tailwind.scss';
import { startAutocomplete } from './autocomplete';
import {
  PATHNAMES,
  REQUEST_INPUT_SELECTOR,
  SEARCH_INPUT_SELECTOR,
} from './constants';
import { startTicketForm } from './ticketForm';
import { getContainerAndButton, getElement } from './utils';


export default function (): void {
  if (process.env.NODE_ENV === 'production') {
    if (window.location.pathname === PATHNAMES.form) {
      try {
        const input = getElement<HTMLInputElement>(REQUEST_INPUT_SELECTOR);
        startTicketForm(input);
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
      }
    }
    try {
      const [searchContainer] = getContainerAndButton(SEARCH_INPUT_SELECTOR);
      startAutocomplete(searchContainer);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  } else {
    try {
      const [searchContainer] = getContainerAndButton(SEARCH_INPUT_SELECTOR);
      startAutocomplete(searchContainer);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }

    try {
      const input = getElement<HTMLInputElement>(REQUEST_INPUT_SELECTOR);
      startTicketForm(input);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  }
}

export { startAutocomplete };
