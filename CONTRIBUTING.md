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

You can create new badges directly on the official [shields.io](https://shields.io/badges) site by following their documentation.  
When you have created your personalized badge and want it to be added to the badge library, follow these steps below

1. [Fork](https://github.com/GFrancV/markdown-badges/fork) the project
2. Clone the forked project (`git clone <URL>`)
3. Add the badge to the `src/consts/badges.json` with the name, url and markdown codeq
4. Create a new branch (`git checkout -b badge/badge-name`)
5. Commit your changes (`git commit -am 'Add new badge-name badge'`)
6. Push to the branch (`git push origin badge/badge-name`)
7. Create a new [Pull Request](https://github.com/GFrancV/markdown-badges/pulls)

## Good Practices

- Check the open issues before opening a PR, if you think you can solve it and there are no other PR already open, use `#issue-number` in your commit so that it is added to the issue. It doesn't hurt to leave a comment so that it is known which PR is being used for the issue.
- See if any PR is already open for the same issue, if so, try to help in the review process, comments or or bringing changes.
- Keep your commits clean and descriptive using the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) pattern to commit your changes.
- Follow the project's code conventions.
- Install the recommended vscode extensions to help you with the code conventions.

Thanks for contributing! 🚀
