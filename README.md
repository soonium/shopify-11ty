# Netlify / Shopify / WordPress - Simple Demo Site

```
# install the dependencies
npm i

# Run the local dev server during development
netlify dev

# Build the site
npm run build
```

## Environment variables

```conf
WP_QL_ENDPOINT = "{WP SITE URL}/index.php?graphql"
SHOPIFY_API_ENDPOINT = "{YOUR SHOPIFY STORE URL}/api/unstable/graphql.json"
SHOPIFY_STOREFRONT_API_TOKEN = "{YOUR SHOPIFY STOREFRONT ACCESS TOKEN}"
```

## Useful Links

Expansion of GraphQL WP Endpoint for Blocks - https://github.com/wpengine/wp-graphql-content-blocks
