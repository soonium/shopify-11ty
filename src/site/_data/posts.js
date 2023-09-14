const { postToWordPress } = require('../../../netlify/functions/utils/postToWordPress');

module.exports = async () => {

  const response = await postToWordPress({
    query: `{
        posts(first: 10) {
            edges {
                node {
                  id
                  title
                  slug
                  modified
                  content
                  featuredImage {
                    node {
                      mediaItemUrl
                    }
                  }
                }
            }
            }
    }`,
    variables: null
  });
  
  return response.posts.edges;

};