const groq = require('groq')
const {createClient} = require('@sanity/client')

const client = createClient({
    projectId: '5y5s7omv',
    dataset: 'production',
    apiVersion: '2023-05-03',
    token: 'skd3IKZwJFkUfEG7YTOFep7z4y1LU6EFDcQV28bBOlSGnJrR6dhBvF2dv7xT0eTiosHrSbJqDj4QR3kigjQUdrPVBt5LiJq8sJXukFKw9JfoS8nGaXThyrKFfibDZBEzkDrvxv0ICTRLK4WNomtWll0h41Noqw6h6RJTsq98alG3k95Gf9PH',
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