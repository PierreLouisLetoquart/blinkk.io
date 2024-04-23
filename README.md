# Blinkk

The next generation search engine.

## Context

This project is a simple POC to demonstrate the use of RAG, PS, and simple summurization techniques to create a search engine that can generate THE answer to a query.

### How it works ?

![arch schema]("/assets/abc.png")

## Google Custom Search JSON API

For the step of fetching web resources. Requires a Google account.

### Query

Three parameters are required for each request to the Rest API:

- `key` : the Google API key ([find here](https://console.cloud.google.com/apis))
- `cx` : the search engine ID ([find here](https://programmablesearchengine.google.com/controlpanel/all))
- `q` : the query text itself

Other optional parameters can be used, we will use the following ones:

- `lr`: the language of content in response
- `filter`: avoid duplicate content in response

> Note: the request body must be empty

### Results

The response type is described [here](https://developers.google.com/custom-search/v1/reference/rest/v1/Search).

## To explore

To summurize content:

https://js.langchain.com/docs/use_cases/summarization

To extract relevant data with `zod`:

https://js.langchain.com/docs/use_cases/extraction/quickstart
