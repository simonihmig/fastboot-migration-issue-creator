# fastboot-migration-issue-creator

Create a Github issue for every addon that has known issues with the breaking changes introduced by FastBoot 1.0.

## Usage

```bash
node src/index.js -u <github_username> -p <github_password>
node src/index.js -u <github_username> -p <github_password> -t // test mode, don't create issues
```