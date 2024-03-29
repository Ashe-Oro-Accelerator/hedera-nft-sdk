# Publishing to NPM instructions

This document provides step-by-step instructions for publishing new versions of the hedera-nft-sdk to NPM. Please follow these steps carefully to ensure a smooth publication process.

## Prerequisites

- Ensure you have an NPM account under the `@arianelabs.com` domain,
- You must have the necessary permissions to publish the package. Only hedera-nft-sdk collaborators can push new versions to NPM.

## Steps

### 1. Login to NPM

First, you need to be logged into your NPM account. In your terminal type:

```bash
npm login
```

After running this command, a login prompt will appear. Follow the instructions, and a link to the login page will be provided. Press "Enter" to open it and complete the login process. If you don't have NPM account using `@arianelabs.com` domain you need to create it first.

### 2. Verify Login Status

To confirm that you're logged in correctly, use the following command:

```bash
npm whoami
```

If it returns an error, it likely means you are not logged in. If successful, it will display your username in your terminal.

### 3. Update Application Version

Before publishing, update the application version in your `package.json` file. Follow the [semantic versioning guidelines](https://docs.npmjs.com/about-semantic-versioning) to update the version number correctly.

### 4. Build the Application

Build your application using the following command:

```bash
pnpm run build
```

Ensure the build completes successfully before proceeding to the next step.

### 5. Publish to NPM

Finally, publish the package to NPM using:

```bash
npm publish
```

Initially, when publishing a new package, you should use the `--access public` flag if you want it to be visible publicly on NPM.

```bash
npm publish --access public
```

This flag is required only for the first publication of a new package. For subsequent updates, simply using npm publish is sufficient.
For more information about scopes, please visit [About Public Packages](https://docs.npmjs.com/about-public-packages).

After that your files should be pushed to NPM immediately.
