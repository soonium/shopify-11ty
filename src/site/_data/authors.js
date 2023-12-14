const groq = require('groq')
const {createClient} = require('@sanity/client')

const client = createClient({
    projectId: '9s1ixzac',
    dataset: 'production',
    apiVersion: '2023-05-03',
    token: 'skUpduAw4S3ija62dmCpV744qW6S8G2yT7Iyak054yPkZpzv2ivvFL51MZCOPu5Cql2k61Rtj3vIijiiu4jbX9lIhLWVUknFCEVNAOJnIh94zS9uvk9iUcNQgHxrbRsWUsvrONAG5a08SPgoAFYbeZfpz0KZOFl6x6WOasQvwwkdwV1R7761',
    useCdn: false,
  })

module.exports = async function() {
  const filter = groq`*[ 
    _type == "author" && 
    !(_id in path("drafts.**")) 
  ]`
  const projection = groq`{
    name,
    publishedAt
  }`
  const order = groq`| order(publishedAt desc)`
  const query = [filter, projection, order].join(' ')
  return await client.fetch(query)
}