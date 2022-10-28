<div align="center">
    <h1><strong>Algolia's Help Center Search</strong></h1>

[![Version](https://img.shields.io/npm/v/@algolia/algolia-custom-helpcenter-search.svg?style=flat-square)](https://www.npmjs.com/package/@algolia/autocomplete-js)
</div>

# NOTE FOR PUBLIC RELEASE

This is a public copy of the custom zendesk search for Algolia. It previously used Algolia answers, but now uses the search endpoint instead-- some naming conventions use "answers" however.

**This public fork is not currently a supported integration**. We will not be providing support for implementation of this public repository.


## What is this

The front-end bundle for Algolia's [Help Center](https://algolia.zendesk.com/hc/en-us) search experience.
It consists of:

- The autocomplete search present on the homepage with the main search bar as well as on all pages with a smaller search bar on the top right. This is leveraging classic InstantSearch and Algolia Answers for the "best hit".
- The [ticket form request](https://algolia.zendesk.com/hc/en-us/requests/new) search: when typing in the "Subject" field, search results will display right underneath the input. This is leveraging Algolia Answers.

Searches are happening on 3 indices across 3 apps:

- Help Center articles
- Documentation
- Discourse posts

<br>

## How does it work

When built and released, the `css` and `js` bundles are hosted on jsdelivr. We then add the files to our Zendesk Help Center theme through simple `<link>` and `<script>` tags in the theme code editor.

In Zendesk's HC `document_head.hbs` template, add the styles, replacing `@{THE_VERSION}` with your prefered version, eg `@1` or `@1.1.0`:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@algolia/algolia-custom-helpcenter-search@{THE_VERSION}/lib/index.css"
/>
```

In the `footer.hbs` template, add the javascript:

```html
<script src="https://cdn.jsdelivr.net/npm/@algolia/algolia-custom-helpcenter-search@{THE_VERSION}/lib/index.js"></script>
```

<br>

## Configuration

This package does not (at least for now) expose any kind of module or global function in the browser. This means any configuration change must happen through a [commit on this repository](#development) and then a [release](#releasing).

Almost all of the configuration happens in the `src/constants.ts` file. There you will find variables that you can change if needed for:

- Sources (this is where the algolia indices and apps are defined)
- CSS Selectors (for your autocomplete and ticket form search initialization, default selectors are the one from the default Help Center theme)
- Placeholder for the autocomplete
- Base Urls for the search redirections.

<br>

## Development

To start developing:

1. Install all dependencies:

```bash
yarn
```

or

```bash
npm install
```

2. Launch the dev server:

```bash
yarn dev
```

or

```bash
npm run dev
```

You can find everything related to the **autocomplete** search in `src/autocomplete.tsx`. We are using Algolia's [autocomplete library](https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/) to develop our autocomplete and are leveraging some styles from [DocSearch](https://github.com/algolia/DocSearch).

You can find everything related to the **ticket form** input search in `src/ticketForm.tsx`. It's basically a mini app written using `preact`.

You can find the **config** variables in `src/constants.ts`. See [configuration](#configuration).

Don't forget to update the tests in `src/__tests__`if needed. `Jest` and [`Testing Library`](https://testing-library.com/docs/) are used for testing.

<br>
