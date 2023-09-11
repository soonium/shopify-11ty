/**
 * API Endpoint
 *
 * * Purpose: Get items from an existing cart
 * @param {string} cartId
 *
 * Example:
 *```
 * fetch('/.netlify/functions/get-cart', {
 *   method: 'POST',
 *   body: JSON.stringify({ cartId: '12345' })
 * })
 * ```
 *
 * ! POST method is intentional for future enhancement
 *
 * TODO: Add enhancement for pagination
 */

const { postToShopify } = require('./utils/postToShopify')

exports.handler = async (event) => {
  const { cartId } = JSON.parse(event.body);
  try {
    console.log('--------------------------------')
    console.log('Retrieving existing cart...')
    console.log('--------------------------------')
    const shopifyResponse = await postToShopify({
      query: `
        query checkoutURL($cartId: ID!) {
          cart(id: $cartId) {
            checkoutUrl
          }
        }
      `,
      variables: {
        cartId,
      },
    })
    return {
      statusCode: 200,
      body: JSON.stringify(shopifyResponse),
    }
  } catch (error) {
    console.log(error)
  }
}
