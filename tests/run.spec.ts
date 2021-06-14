import { run } from '../src/run'
import * as scalewayApi from '../src/scalewayApi'

const logSpy = jest.spyOn(console, 'log')
const getImageSpy = jest.spyOn(scalewayApi, 'getImage')
const listTagsSpy = jest.spyOn(scalewayApi, 'listTags')
const deleteTagSpy = jest.spyOn(scalewayApi, 'deleteTag')

const INPUT = {
  scwSecretToken: '03a23c20-d00c-4e80-9166-bf9318c949de',
  image: 'rg.nl-ams.scw.cloud/devoxa/hello-world',
  tagPattern: '^(?!pr-).+$',
  keepLast: '2',
}

describe('run', () => {
  beforeEach(() => {
    logSpy.mockReset()
    getImageSpy.mockReset()
    listTagsSpy.mockReset()
    deleteTagSpy.mockReset()
  })

  it('can prune excess tags', async () => {
    getImageSpy.mockReturnValueOnce(Promise.resolve({ id: 'image-id', name: 'image-name' }))
    listTagsSpy.mockReturnValueOnce(
      Promise.resolve([
        { id: 'tag-id-4', name: 'tag-name-a', created_at: '2021-01-04' }, // Keep
        { id: 'tag-id-3', name: 'pr-123', created_at: '2021-01-03' }, // Skip
        { id: 'tag-id-2', name: 'tag-name-b', created_at: '2021-01-02' }, // Keep
        { id: 'tag-id-1', name: 'tag-name-c', created_at: '2021-01-01' }, // Prune
        { id: 'tag-id-0', name: 'tag-name-d', created_at: '2020-01-01' }, // Prune
      ])
    )

    await run(INPUT)

    expect(logSpy.mock.calls).toMatchSnapshot()
    expect(deleteTagSpy.mock.calls).toMatchSnapshot()
  })

  it('can prune all tags', async () => {
    getImageSpy.mockReturnValueOnce(Promise.resolve({ id: 'image-id', name: 'image-name' }))
    listTagsSpy.mockReturnValueOnce(
      Promise.resolve([
        { id: 'tag-id-4', name: 'tag-name-a', created_at: '2021-01-04' }, // Prune
        { id: 'tag-id-3', name: 'pr-123', created_at: '2021-01-03' }, // Skip
        { id: 'tag-id-2', name: 'tag-name-b', created_at: '2021-01-02' }, // Prune
        { id: 'tag-id-1', name: 'tag-name-c', created_at: '2021-01-01' }, // Prune
        { id: 'tag-id-0', name: 'tag-name-d', created_at: '2020-01-01' }, // Prune
      ])
    )

    await run({ ...INPUT, keepLast: '0' })

    expect(deleteTagSpy.mock.calls).toMatchSnapshot()
  })

  it('can prune no tags', async () => {
    getImageSpy.mockReturnValueOnce(Promise.resolve({ id: 'image-id', name: 'image-name' }))
    listTagsSpy.mockReturnValueOnce(
      Promise.resolve([
        { id: 'tag-id-4', name: 'tag-name-a', created_at: '2021-01-04' }, // Keep
        { id: 'tag-id-3', name: 'pr-123', created_at: '2021-01-03' }, // Skip
        { id: 'tag-id-2', name: 'tag-name-b', created_at: '2021-01-02' }, // Keep
        { id: 'tag-id-1', name: 'tag-name-c', created_at: '2021-01-01' }, // Keep
        { id: 'tag-id-0', name: 'tag-name-d', created_at: '2020-01-01' }, // Keep
      ])
    )

    await run({ ...INPUT, keepLast: '50' })

    expect(deleteTagSpy.mock.calls).toEqual([])
  })
})
