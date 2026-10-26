# Contribution Guide

If you have any ideas on how to improve this project, feel free to contribute! First create a [fork](https://github.com/GFrancV/markdown-badges/fork) of the project and create a new branch with the feature you want to add. After that, open a [pull request](https://github.com/GFrancV/markdown-badges/pulls) and wait for the review. You can also open a [issue](https://github.com/GFrancV/markdown-badges/issues) with the "enchantment" label.

Bellow you can see a quick guide:

1. [Fork](https://github.com/GFrancV/markdown-badges/fork) the project
2. Clone the forked project (`git clone <URL>`)
3. Create a new branch (`git checkout -b feature/feature-name`)
4. Commit your changes (`git commit -m 'feat: Add new feature'`)
5. Push to the branch (`git push origin feature/feature-name`)
6. Create a new [Pull Request](https://github.com/GFrancV/markdown-badges/pulls)

## How to add a new badge

Most badges are synced weekly from [Ileriayo/markdown-badges](https://github.com/Ileriayo/markdown-badges) into `data/badges.upstream.json`. **Do not edit `data/badges.upstream.json` by hand**, it is overwritten by every sync. `data/badges.json` is a gitignored build artifact. Badges owned by this project live in `data/badges.custom.json` and are merged on top of the synced ones (a custom badge with the same `id` or `url` replaces the upstream one).

You can create new badges directly on the official [shields.io](https://shields.io/badges) site by following their documentation.  
When you have created your personalized badge and want it to be added to the badge library, follow these steps below

1. [Fork](https://github.com/GFrancV/markdown-badges/fork) the project
2. Clone the forked project (`git clone <URL>`)
3. Create a new branch (`git checkout -b badge/badge-name`)
4. Add the badge to `data/badges.custom.json` (see the format below)
5. Run `pnpm test` to check it (it regenerates `data/badges.json` first)
6. Commit your changes (`git commit -m 'feat(badges): add badge-name badge'`)
7. Push to the branch (`git push origin badge/badge-name`)
8. Create a new [Pull Request](https://github.com/GFrancV/markdown-badges/pulls)

### Badge format

```json
{
  "id": "my-tool",
  "name": "My Tool",
  "url": "https://img.shields.io/badge/My%20Tool-000000?style=for-the-badge&logo=mytool&logoColor=white",
  "markdown": "![My Tool](https://img.shields.io/badge/My%20Tool-000000?style=for-the-badge&logo=mytool&logoColor=white)",
  "categories": ["Frameworks"]
}
```

- `id`: the `name` in lowercase with spaces replaced by `-`. It must be unique.
- `url`: a `img.shields.io` URL, identical to the one inside `markdown`.
- `categories`: reuse an existing category whenever possible.

### Logos not available in Simple Icons

The `logo` parameter accepts any [Simple Icons](https://simpleicons.org/) slug. If the logo is not there, embed it as a base64 SVG data URI instead. Minify the SVG first (e.g. with [SVGO](https://jakearchibald.github.io/svgomg/)) to keep the URL short, then encode it:

```bash
node -e "console.log(encodeURIComponent('data:image/svg+xml;base64,' + require('fs').readFileSync(process.argv[1]).toString('base64')))" logo.svg
```

Use the output as the value of `logo=` in both `url` and `markdown`.

## Good Practices

- Check the open issues before opening a PR, if you think you can solve it and there are no other PR already open, use `#issue-number` in your commit so that it is added to the issue. It doesn't hurt to leave a comment so that it is known which PR is being used for the issue.
- See if any PR is already open for the same issue, if so, try to help in the review process, comments or or bringing changes.
- Keep your commits clean and descriptive using the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) pattern to commit your changes.
- Follow the project's code conventions.
- Install the recommended vscode extensions to help you with the code conventions.

Thanks for contributing! 🚀
