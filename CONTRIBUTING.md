# Contributing to MTC.LBS Git & GitHub Workshop

This project welcomes beginner-friendly pull requests. Follow the steps below before adding your participant profile.

## Contribution workflow

1. Fork the repository to your GitHub account.
2. Clone your fork to your computer.
3. Create a branch named `add-YOUR_GITHUB_USERNAME`.
4. Add or update your participant file in `participants/`.
5. Validate the JSON file.
6. Commit your changes.
7. Push the branch to your fork.
8. Open a pull request to the original repository's `main` branch.
9. Wait for review and merge.

## File naming and schema

Create a file using your GitHub username:

```text
participants/YOUR_GITHUB_USERNAME.json
```

The JSON file must use this exact schema:

```json
{
  "name": "Your Full Name",
  "city": "Your City",
  "fundact": "Your Main Technical Interest"
}
```

Rules:

- `name` is required and must be a string.
- `city` is required and must be a string.
- `fundact` is required and must be a string.
- Use the exact property name `fundact`.
- Do not include passwords, tokens, addresses, or other sensitive data.
- Do not use a second file for the same username.

## Branch naming

Use a single branch per participant, following this pattern:

```bash
git switch -c add-YOUR_GITHUB_USERNAME
```

Example:

```bash
git switch -c add-NoureddineGouiaa
```

## Commit message format

Use a clear commit message such as:

```bash
git commit -m "Add YOUR_GITHUB_USERNAME as a participant"
```

## Pull request checklist

Before opening a pull request, check:

- [ ] The file is in the `participants/` folder.
- [ ] The filename matches the GitHub username.
- [ ] The JSON is valid and uses the required keys.
- [ ] The branch is named correctly.
- [ ] The commit message is clear.
- [ ] No sensitive information is included.
- [ ] No other participant file was overwritten.
- [ ] The pull request targets the original repository's `main` branch.

## Validation

The repository includes a manifest generation script that validates all participant files.

```bash
python3 scripts/generate_manifest.py
```

If there is an invalid file, fix the JSON before opening the pull request.

## Review expectations

- Keep contributions small and understandable.
- Use clear Git commit messages.
- Respect the original repository and maintainers.
- Avoid editing someone else's profile file.
- If you see a merge conflict, fetch upstream and resolve it carefully without overwriting another participant's contribution.

## GitHub Pages note

When deployed through GitHub Pages, the site loads the generated `participants/manifest.json`. The owner of the repository must enable Pages and publish the site from the correct branch and folder.

## Troubleshooting

If you see a problem, review the workshop documentation and check the repository instructions carefully.

- Git is missing: `git --version`
- Authentication fails: `gh auth login` and `gh auth status`
- Status is empty: `git status`
- Push is rejected: check the remote and target branch
- Pull request is wrong: verify the base repository and base branch
- Participant does not appear: confirm the JSON is valid and the workflow regenerated the manifest
