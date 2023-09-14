const fetch = require('node-fetch');
const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

require('dotenv').config();
exports.postToWordPress = async ({ query, variables }) => {
  try {
    const result = await fetch("https://wp-local.com/index.php?graphql", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      agent: httpsAgent,
      body: JSON.stringify({ query, variables }),
    }).then((res) => res.json())

    if (result.errors) {
      console.log(JSON.stringify(result.errors, null, 2))
    } else if (!result || !result.data) {
      console.log({ result })
      return 'No results found.'
    } 
    /* console.log(JSON.stringify(result.data, null, 2)) */
    return result.data
  } catch (error) {
    console.log(error)
  }
}
