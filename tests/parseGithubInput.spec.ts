import { parseGithubInput } from '../src/parseGithubInput'

const VALID_INPUT = {
  scwSecretToken: '03a23c20-d00c-4e80-9166-bf9318c949de',
  image: 'rg.nl-ams.scw.cloud/devoxa/hello-world',
  tagPattern: '^(?!pr-).+$',
  keepLast: '10',
}

describe('parseGithubInput', () => {
  test('can parse valid input', () => {
    const options = parseGithubInput(VALID_INPUT)
    expect(options).toMatchSnapshot()
  })

  test('errors for invalid scwSecretToken', () => {
    expect(() =>
      parseGithubInput({ ...VALID_INPUT, scwSecretToken: 'foobar' })
    ).toThrowErrorMatchingSnapshot()
  })

  test('errors for invalid image', () => {
    expect(() =>
      parseGithubInput({ ...VALID_INPUT, image: 'scw.cloud/devoxa/hello-world' })
    ).toThrowErrorMatchingSnapshot()
  })

  test('errors for invalid tagPattern', () => {
    expect(() =>
      parseGithubInput({ ...VALID_INPUT, tagPattern: '[' })
    ).toThrowErrorMatchingSnapshot()
  })

  test('errors for invalid keepLast', () => {
    expect(() =>
      parseGithubInput({ ...VALID_INPUT, keepLast: 'TEN' })
    ).toThrowErrorMatchingSnapshot()

    expect(() =>
      parseGithubInput({ ...VALID_INPUT, keepLast: '1000' })
    ).toThrowErrorMatchingSnapshot()
  })
})
