import { getInput } from '@actions/core'
import { run } from './run'

run({
  scwSecretToken: getInput('scw-secret-token'),
  image: getInput('image'),
  tagPattern: getInput('tag-pattern'),
  keepLast: getInput('keep-last'),
})
