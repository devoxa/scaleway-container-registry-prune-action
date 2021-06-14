import core from '@actions/core'
import { run } from './run'

run({
  scwSecretToken: core.getInput('scw-secret-token'),
  image: core.getInput('image'),
  tagPattern: core.getInput('tag-pattern'),
  keepLast: core.getInput('keep-last'),
})
