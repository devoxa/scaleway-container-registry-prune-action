<!-- Title -->
<h1 align="center">
  scaleway-container-registry-prune-action
</h1>

<!-- Description -->
<h4 align="center">
  Prune images in the Scaleway Container Registry by deleting excess tags via Github Actions
</h4>

<!-- Badges -->
<p align="center">
  <a href="https://github.com/devoxa/scaleway-container-registry-prune-action/actions?query=branch%3Amaster+workflow%3A%22Continuous+Integration%22">
    <img
      src="https://img.shields.io/github/actions/workflow/status/devoxa/scaleway-container-registry-prune-action/push.yml?branch=master&style=flat-square"
      alt="Build Status"
    />
  </a>

  <a href="https://codecov.io/github/devoxa/scaleway-container-registry-prune-action">
    <img
      src="https://img.shields.io/codecov/c/github/devoxa/scaleway-container-registry-prune-action/master?style=flat-square"
      alt="Code Coverage"
    />
  </a>
</p>

<!-- Quicklinks -->
<p align="center">
  <a href="#usage">Usage</a> •
  <a href="#contributors">Contributors</a> •
  <a href="#license">License</a>
</p>

<br>

## Usage

```yml
steps:
  - name: 'Prune excess Docker tags from registry'
    uses: devoxa/scaleway-container-registry-prune-action@v1
    with:
      scw-secret-token: ${{ secrets.SCW_SECRET_TOKEN }}
      image: rg.nl-ams.scw.cloud/devoxa/genesis-server
      tag-pattern: ^(?!pr-).+$
      keep-last: 10
```

### Inputs

| Name               | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `scw-secret-token` | The "secret key" part of a Scaleway API key                  |
| `image`            | The name of the image that should be pruned                  |
| `tag-pattern`      | A regular expression matching the tags that should be pruned |
| `keep-last`        | The number of most recent tags to keep                       |

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.david-reess.de"><img src="https://avatars3.githubusercontent.com/u/4615516?v=4?s=75" width="75px;" alt=""/><br /><sub><b>David Reeß</b></sub></a><br /><a href="https://github.com/devoxa/scaleway-container-registry-prune-action/commits?author=queicherius" title="Code">💻</a> <a href="https://github.com/devoxa/scaleway-container-registry-prune-action/commits?author=queicherius" title="Documentation">📖</a> <a href="https://github.com/devoxa/scaleway-container-registry-prune-action/commits?author=queicherius" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!

## License

MIT
