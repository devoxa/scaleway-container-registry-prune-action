/* eslint-disable @typescript-eslint/ban-ts-comment */
import fetch from 'node-fetch'
import { deleteTag, getImage, listTags } from '../src/scalewayApi'

jest.mock('node-fetch')

function mockFetchJson(value: unknown) {
  // @ts-ignore
  fetch.mockReturnValue(Promise.resolve({ json: async () => value }))
}

function getFetchCall() {
  // @ts-ignore
  return fetch.mock.calls[0]
}

describe('scalewayApi', () => {
  beforeEach(() => {
    // @ts-ignore
    fetch.mockReset()
  })

  describe('getImage', () => {
    it('can get the image from the API', async () => {
      mockFetchJson({
        images: [{ id: 'image-id', name: 'image-name' }],
      })

      const image = await getImage('scw-token', 'scw-region', 'image-name')

      expect(image).toMatchSnapshot()
      expect(getFetchCall()).toMatchSnapshot()
    })

    it('throws an error if the image is not in the API', async () => {
      mockFetchJson({
        images: [],
      })

      let error
      try {
        await getImage('scw-token', 'scw-region', 'image-name')
      } catch (err) {
        error = err
      }

      expect(error).toMatchSnapshot()
    })
  })

  describe('listTags', () => {
    it('can list the tags from the API', async () => {
      mockFetchJson({
        tags: [
          { id: 'tag-id-1', name: 'tag-name-1', updated_at: '2021-01-03' },
          { id: 'tag-id-2', name: 'tag-name-2', updated_at: '2021-01-02' },
          { id: 'tag-id-3', name: 'tag-name-3', updated_at: '2021-01-01' },
        ],
      })

      const tags = await listTags('scw-token', 'scw-region', 'image-id')

      expect(tags).toMatchSnapshot()
      expect(getFetchCall()).toMatchSnapshot()
    })

    it('throws an error if there are no tags in the API', async () => {
      mockFetchJson({
        tags: [],
      })

      let error
      try {
        await listTags('scw-token', 'scw-region', 'image-id')
      } catch (err) {
        error = err
      }

      expect(error).toMatchSnapshot()
    })
  })

  describe('deleteTag', () => {
    it('can delete the tag from the API', async () => {
      mockFetchJson({ id: 'tag-id-1', name: 'tag-name-1', updated_at: '2021-01-03' })

      const tag = await deleteTag('scw-token', 'scw-region', 'tag-id-1')

      expect(tag).toMatchSnapshot()
      expect(getFetchCall()).toMatchSnapshot()
    })

    it('throws an error if the deletion from the API failed', async () => {
      mockFetchJson({ id: 'nope' })

      let error
      try {
        await deleteTag('scw-token', 'scw-region', 'tag-id-1')
      } catch (err) {
        error = err
      }

      expect(error).toMatchSnapshot()
    })
  })
})
