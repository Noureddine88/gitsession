# MTC.LBS | Git & GitHub Workshop

This project is a beginner-friendly Git workshop where every participant adds a JSON profile to a shared website. The website shows all valid participants and updates automatically when the repository accepts new pull requests.

## Project goals

- Learn Git and GitHub in a practical workshop.
- Practice forking, cloning, branching, committing, pushing, and opening pull requests.
- Build a simple community directory from participant JSON files.
- Host the site with GitHub Pages without requiring a backend.

## Repository structure

```text
/
├── index.html
├── style.css
├── script.js
├── README.md
├── CONTRIBUTING.md
├── MTC-LBS-Git-GitHub-Workshop.pptx
├── .gitignore
├── .github/
│   └── workflows/
│       └── generate-manifest.yml
├── scripts/
│   └── generate_manifest.py
├── participants/
│   ├── ExampleGithubName.json
│   └── manifest.json
```

The editable PowerPoint workshop presentation is `MTC-LBS-Git-GitHub-Workshop.pptx`.

## Local setup

1. Clone the repository.
2. Open the folder in Visual Studio Code or another editor.
3. Optionally run a local static server to preview the site.

```bash
cd YOUR_REPOSITORY
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## JSON schema

Each participant file in the `participants/` folder must follow this shape:

```json
{
  "name": "Your Full Name",
  "city": "Your City",
  "fundact": "Your Main Technical Interest"
}
```

- `name`: the participant's full display name.
- `city`: the city where the participant lives or studies.
- `fundact`: the participant's main technical interest or fundamental activity.
- Keep the property name exactly as `fundact`.
- Name the file after the participant's GitHub username, such as `participants/NoureddineGouiaa.json`. The site uses this filename to load the participant's public GitHub avatar; the account must be public for the image to resolve.
- Do not store passwords, tokens, private addresses, or sensitive data.

## Manifest generation

The website reads the generated `participants/manifest.json` instead of scanning the folder in the browser. This avoids browser-only file system access issues on static hosting.

Run the generator locally:

```bash
python3 scripts/generate_manifest.py
```

The script validates every JSON file in `participants/*.json`, excluding `manifest.json`, and updates the manifest.
After a pull request is merged, the site checks for manifest changes every 30 seconds while the page is open and automatically reloads participant cards when the list changes. The manifest-generation workflow must finish before the new participant can appear.

## GitHub Pages

This site is designed for GitHub Pages compatibility. The project is static HTML/CSS/JS and does not need a build step.

Repository owner instructions:

1. Open the GitHub repository.
2. Go to Settings > Pages.
3. Select `Deploy from a branch`.
4. Choose the `main` branch and the root folder (`/`).
5. Save the settings.
6. GitHub will publish the site at a URL such as `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`.

If the site is built in a different branch or folder, update the path and documentation accordingly.

## Beginner Git workshop

### Step 1 — Configure Git

Participants need Git installed and a GitHub account.

```bash
git --version
git config --global user.name "Your Name"
git config --global user.email "your-github-email@example.com"
```

The first command checks whether Git is installed. If Git is not installed, install it from the official Git website. The next two commands configure your name and email used in your commit history.

For authentication, use HTTPS or the GitHub CLI. The recommended approach is:

```bash
gh auth login
gh auth status
```

This logs the user into GitHub securely through the GitHub CLI and verifies the session. Do not share passwords, tokens, or private keys.

### Step 2 — Fork the project

Open the original repository on GitHub and click `Fork` to create a copy in the participant's own GitHub account.

Important: the original repository is called `upstream`, and the participant's copy is `origin`.

### Step 3 — Clone their fork

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

Replace the placeholders with the participant's account name and repository name. The participant is now working in their own forked copy of the project.

### Step 4 — Create a new branch

```bash
git switch -c add-YOUR_GITHUB_USERNAME
```

Everyone works on a separate branch instead of editing the `main` branch directly. This keeps changes organized and easier to review.

### Step 5 — Create their JSON file manually

Open the `participants` folder in VS Code or another editor and create a file named after the participant's GitHub username:

```text
participants/YOUR_GITHUB_USERNAME.json
```

Write valid JSON like this:

```json
{
  "name": "Your Full Name",
  "city": "Your City",
  "fundact": "Your Main Technical Interest"
}
```

JSON requires double quotes around keys and string values. Separate properties with commas, except the last one. The filename must match the GitHub username exactly. It should not include personal secrets, addresses, tokens, or passwords.

### Step 6 — Inspect changes with git status

```bash
git status
```

A newly created file usually appears as an untracked file in red in common terminal color schemes. Colors may vary depending on the terminal theme or settings.

### Step 7 — Stage the JSON file

```bash
git add participants/YOUR_GITHUB_USERNAME.json
git status
```

This stages the file so Git knows the new version is ready to be committed. In common terminals, the file often appears green when it is staged.

### Step 8 — Commit the change

```bash
git commit -m "Add YOUR_GITHUB_USERNAME as a participant"
```

A commit is a saved snapshot of your work. This creates a record that can be shared and reviewed.

To confirm the result:

```bash
git log -1 --oneline
```

### Step 9 — Push the branch to their fork

```bash
git push -u origin add-YOUR_GITHUB_USERNAME
```

`origin` is the remote for the participant's fork. `push` sends the branch to GitHub. `-u` sets the upstream tracking branch so future pushes are simpler.

### Step 10 — Open a pull request

After pushing the branch, open the fork on GitHub and choose the option to create a pull request.

Choose the base repository and base branch carefully:

- Base repository: the original repository owner
- Base branch: `main`
- Head repository: the participant's fork
- Compare branch: `add-YOUR_GITHUB_USERNAME`

The repository owner or a maintainer reviews the pull request and merges it when the change is valid.

### Step 11 — Update the original project

A very important point: `git pull` does not move a participant's changes from their fork into the original repository. A pull request must be reviewed and merged first.

After a maintainer merges the pull request, the original repository contains the new participant. To update a local copy of the original repository, configure `upstream` if needed:

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git
git fetch upstream
git switch main
git pull upstream main
```

These commands update the local checkout from the original repository. The participant's website will display the new participant after the change is merged and the manifest generation workflow finishes.

If a maintainer cloned the original repository directly, they can use:

```bash
git pull origin main
```

This is the simpler case when the repo already points to the original repository and no fork is involved.

## Common errors and troubleshooting

### Git is not installed

Check whether Git is installed:

```bash
git --version
```

If Git is missing, install it from the official Git website and reopen the terminal.

### GitHub authentication fails

Verify the GitHub CLI is logged in:

```bash
gh auth status
```

If needed, run:

```bash
gh auth login
```

Do not share passwords or tokens in commit messages, issues, or config files.

### The participant cloned the original repository instead of their fork

Check the remotes:

```bash
git remote -v
```

If the `origin` remote points to the original repository instead of the participant's fork, update the remote or clone the fork again. The fork should be the participant's own copy.

### A branch already exists

If the branch name exists already, switch to it or choose a different branch name:

```bash
git switch add-YOUR_GITHUB_USERNAME
```

If you need a new and unique branch name, choose a fresh name that matches the workflow used in the workshop.

### JSON syntax errors

Check the JSON file carefully. Common mistakes include missing commas, trailing commas, and broken quotes. Use a formatter or editor validation to fix syntax.

### A filename does not match the expected pattern

The file name must match the participant's GitHub username exactly. For example:

```text
participants/NoureddineGouiaa.json
```

Do not use spaces or an alternate username in the filename.

### git status shows no changes

Make sure the file was created in the correct folder and saved to disk. Then check the path again:

```bash
git status
```

If no changes appear, confirm the file exists and has content in `participants/`.

### Push is rejected

Common reasons include:

- branch name already exists remotely
- repository permissions are limited
- the local branch is behind the remote

First pull or fetch the latest changes from the appropriate branch, then retry. Always check the correct remote before pushing.

### A pull request targets the wrong repository or branch

Before submitting the PR, check the base repository, base branch, head repository, and compare branch. The participant must target the original repository's `main` branch, not their personal fork's default branch.

### The participant tries to push directly to the original repository without permission

A contributor should never push directly to the original repository unless they have explicit maintainer rights. The correct sequence is: fork, clone, branch, commit, push to `origin`, then open a pull request.

### A merged participant does not appear on the website

Check the following:

1. The pull request was merged successfully.
2. The new JSON file is valid and saved in `participants/`.
3. The project action ran and generated a fresh `participants/manifest.json`.
4. The GitHub Pages site was rebuilt or reloaded.
5. Refresh the page after deployment. The site requests the manifest with a fresh cache key so old CDN/browser copies do not hide newly merged participants.

### Two participants choose the same GitHub username filename

This creates a conflict because both contributors would try to write the same file. Always choose a unique username-based filename and never overwrite another participant's file. Use one file per GitHub username.

## Pull and fetch workflow for updated upstream changes

Before retrying after a conflict or after a long break, update your local repository from the original project:

```bash
git fetch upstream
git switch main
git pull upstream main
```

Then create a fresh branch for your next change.

## Contribution rules

- Use one JSON file per GitHub username.
- The file must live in `participants/`.
- Keep the file schema exactly as `name`, `city`, and `fundact`.
- Use a branch name with the format `add-YOUR_GITHUB_USERNAME`.
- Write helpful commit messages, such as `Add YOUR_GITHUB_USERNAME as a participant`.
- Open a pull request to the original repository.
- Never overwrite another participant's file.
- Never commit tokens, passwords, private keys, or personal secret data.

## Security and repository rules

- Never store passwords, tokens, or private secrets in participant JSON files.
- Only publish non-sensitive public information.
- Use pull requests to review and merge all entries.
- Debug invalid JSON before merging.
- Keep builds static and avoid generated artifacts unless GitHub Pages requires them.
- The repository owner must enable GitHub Pages and configure the workflow if needed.

## Acceptance tests

Before finishing the workshop, verify the following:

- the website displays all valid participant JSON files
- search and filters work correctly
- malformed JSON is handled clearly
- new participants are automatically included in the generated manifest
- the documentation contains each command from the workshop
- the git instructions correctly distinguish fork, clone, branch, add, commit, push, pull request, merge, fetch, and pull
- filenames and links are consistent and correct

## License

This project is intended for educational use in a club workshop. Add a license if your organization wants an explicit legal statement.
