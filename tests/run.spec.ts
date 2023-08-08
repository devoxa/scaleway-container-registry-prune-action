import { run } from '../src/run'
import * as scalewayApi from '../src/scalewayApi'

const logSpy = jest.spyOn(console, 'log')

jest.mock('../src/scalewayApi')
const mockGetImage = jest.mocked(scalewayApi.getImage)
const mockListTags = jest.mocked(scalewayApi.listTags)
const mockDeleteTag = jest.mocked(scalewayApi.deleteTag)

const INPUT = {
  scwSecretToken: '03a23c20-d00c-4e80-9166-bf9318c949de',
  image: 'rg.nl-ams.scw.cloud/devoxa/hello-world',
  tagPattern: '^(?!pr-).+$',
  keepLast: '2',
}

describe('run', () => {
  beforeEach(() => {
    logSpy.mockReset()
    mockGetImage.mockReset()
    mockListTags.mockReset()
    mockDeleteTag.mockReset()
  })

  test('can prune excess tags', async () => {
    mockGetImage.mockReturnValueOnce(Promise.resolve({ id: 'image-id', name: 'image-name' }))
    mockListTags.mockReturnValueOnce(
      Promise.resolve([
        { id: 'tag-id-4', name: 'tag-name-a', updated_at: '2021-01-04' }, // Keep
        { id: 'tag-id-3', name: 'pr-123', updated_at: '2021-01-03' }, // Skip
        { id: 'tag-id-2', name: 'tag-name-b', updated_at: '2021-01-02' }, // Keep
        { id: 'tag-id-1', name: 'tag-name-c', updated_at: '2021-01-01' }, // Prune
        { id: 'tag-id-0', name: 'tag-name-d', updated_at: '2020-01-01' }, // Prune
      ])
    )

    await run(INPUT)

    expect(logSpy.mock.calls).toMatchSnapshot()
    expect(mockDeleteTag.mock.calls).toMatchSnapshot()
  })

  test('can prune all tags', async () => {
    mockGetImage.mockReturnValueOnce(Promise.resolve({ id: 'image-id', name: 'image-name' }))
    mockListTags.mockReturnValueOnce(
      Promise.resolve([
        { id: 'tag-id-4', name: 'tag-name-a', updated_at: '2021-01-04' }, // Prune
        { id: 'tag-id-3', name: 'pr-123', updated_at: '2021-01-03' }, // Skip
        { id: 'tag-id-2', name: 'tag-name-b', updated_at: '2021-01-02' }, // Prune
        { id: 'tag-id-1', name: 'tag-name-c', updated_at: '2021-01-01' }, // Prune
        { id: 'tag-id-0', name: 'tag-name-d', updated_at: '2020-01-01' }, // Prune
      ])
    )

    await run({ ...INPUT, keepLast: '0' })

    expect(mockDeleteTag.mock.calls).toMatchSnapshot()
  })

  test('can prune no tags', async () => {
    mockGetImage.mockReturnValueOnce(Promise.resolve({ id: 'image-id', name: 'image-name' }))
    mockListTags.mockReturnValueOnce(
      Promise.resolve([
        { id: 'tag-id-4', name: 'tag-name-a', updated_at: '2021-01-04' }, // Keep
        { id: 'tag-id-3', name: 'pr-123', updated_at: '2021-01-03' }, // Skip
        { id: 'tag-id-2', name: 'tag-name-b', updated_at: '2021-01-02' }, // Keep
        { id: 'tag-id-1', name: 'tag-name-c', updated_at: '2021-01-01' }, // Keep
        { id: 'tag-id-0', name: 'tag-name-d', updated_at: '2020-01-01' }, // Keep
      ])
    )

    await run({ ...INPUT, keepLast: '50' })

    expect(mockDeleteTag.mock.calls).toEqual([])
  })
})
