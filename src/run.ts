import { GithubInput, parseGithubInput } from './parseGithubInput'
import { deleteTag, getImage, listTags } from './scalewayApi'

export async function run(input: GithubInput): Promise<void> {
  const options = parseGithubInput(input)

  const image = await getImage(options.scwSecretToken, options.region, options.imageName)
  const tags = await listTags(options.scwSecretToken, options.region, image.id)

  let count = 0
  for (const tag of tags) {
    if (!tag.name.match(options.tagPattern)) {
      console.log(`Skipping tag: ${tag.name} (${tag.updated_at})`)
      continue
    }

    count++

    if (count <= options.keepLast) {
      console.log(`Keeping tag: ${tag.name} (${tag.updated_at})`)
      continue
    }

    console.log(`Pruning tag: ${tag.name} (${tag.updated_at})`)
    await deleteTag(options.scwSecretToken, options.region, tag.id)
  }
}
