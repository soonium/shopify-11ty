const fetch = require('node-fetch');


require('dotenv').config();


exports.postToShopify = async ({ query, variables }) => {
  try {
    console.log("SHOPIFY ENDPOINT>>> " + process.env.SHOPIFY_API_ENDPOINT);
    console.log("READY TO POST >> " + JSON.stringify({ query, variables }));

    const result = await fetch(process.env.SHOPIFY_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token':
          process.env.SHOPIFY_STOREFRONT_API_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }).then((res) => res.json())

    if (result.errors) {
      console.log({ errors: result.errors })
    } else if (!result || !result.data) {
      console.log({ result })
      return 'No results found.'
    }
    console.log(JSON.stringify(result.data, null, 2))
    return result.data
  } catch (error) {
    console.log(error)
  }
}
