# Contributing

## Code Formatting

We use `prettier` for code formatting, and run it automatically as a
commit-hook. For manual formatting run `yarn format`.

## Pull requests

We work in branches and don't include more than one feature/fix per PR. When
merging into master, we "squash and merge".

## Git Commit Messages

We follow the ["conventional commits"](https://www.conventionalcommits.org)
specification. Use `yarn cm` instead of `git commit` to get a helpful prompt
that enforces that convention.

In the commit message, we use present tense in imperative mood, e.g.
`add feature` not `added feature`, and `move cursor to ...` not
`moves cursor to ...`. Commit messages should be lower-case.

## Release

We use `standard-version` to automatically bump versions and generate a
changelog. Don't forget to run `git push --follow-tags` afterwards.

## Testing

We use `jest` as our testing framework, with `@testing-library/react` for UI
integration tests. For e2e tests we use `cypress`.
