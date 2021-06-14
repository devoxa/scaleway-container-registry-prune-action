import fetch from 'node-fetch'
import querystring from 'querystring'

export async function getImage(scwSecretToken: string, region: string, imageName: string) {
  const response = await fetch(
    `https://api.scaleway.com/registry/v1/regions/${region}/images?name=${imageName}`,
    { headers: { 'x-auth-token': scwSecretToken } }
  )

  const json = await response.json()

  if (!json.images || !json.images[0]) {
    throw new Error('Could not get image from the API')
  }

  return json.images[0] as { id: string; name: string }
}

export async function listTags(scwSecretToken: string, region: string, imageId: string) {
  const query = querystring.encode({
    page_size: 100,
  })

  const response = await fetch(
    `https://api.scaleway.com/registry/v1/regions/${region}/images/${imageId}/tags?${query}`,
    { headers: { 'x-auth-token': scwSecretToken } }
  )

  const json = await response.json()

  if (!json.tags || json.tags.length === 0) {
    throw new Error('Could not list tags from the API')
  }

  // Sort the tags by the time they were last updated (most recent first)
  const tags = json.tags as Array<{ id: string; name: string; updated_at: string }>
  tags.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  return tags
}

export async function deleteTag(scwSecretToken: string, region: string, tagId: string) {
  const query = querystring.encode({
    force: true,
  })

  const response = await fetch(
    `https://api.scaleway.com/registry/v1/regions/${region}/tags/${tagId}?${query}`,
    { method: 'DELETE', headers: { 'x-auth-token': scwSecretToken } }
  )

  const json = await response.json()

  if (json.id !== tagId) {
    throw new Error('Could not delete tag from the API')
  }

  return json as { id: string; name: string; updated_at: string }
}
