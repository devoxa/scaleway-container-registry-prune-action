const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const IMAGE_REGEX = /^rg\.(.*?)\.scw.cloud\/[^/]+\/([^/]+)$/i

export interface GithubInput {
  scwSecretToken: string
  image: string
  tagPattern: string
  keepLast: string
}

export interface Options {
  scwSecretToken: string
  region: string
  imageName: string
  tagPattern: RegExp
  keepLast: number
}

export function parseGithubInput(input: GithubInput): Options {
  if (!input.scwSecretToken.match(UUID_REGEX)) {
    throw new Error('\'scw-secret-token\' is not a valid "secret key" part of a Scaleway API key')
  }

  const imageMatch = input.image.match(IMAGE_REGEX)
  if (!imageMatch) {
    throw new Error("'image' is not the name of an image on the Scaleway Container Registry")
  }
  const region = imageMatch[1]
  const imageName = imageMatch[2]

  let tagPattern
  try {
    tagPattern = new RegExp(input.tagPattern)
  } catch (err) {
    if (!(err instanceof Error)) throw err
    throw new Error("'tag-pattern' is not a valid regular expression")
  }

  if (!input.keepLast.match(/^\d+$/)) {
    throw new Error("'keep-last' is not a valid positive integer")
  }

  const keepLast = parseInt(input.keepLast, 10)
  if (keepLast >= 100) {
    throw new Error("'keep-last' must be smaller than 100")
  }

  return {
    scwSecretToken: input.scwSecretToken,
    region,
    imageName,
    tagPattern,
    keepLast,
  }
}
