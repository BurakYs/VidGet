# Self Hosting VidGet

If you haven't already, start by downloading [Node](https://nodejs.org) and [Git](https://git-scm.com)

Go to the desktop or any folder, right click and select open a new Command Prompt or Terminal window. Run the following commands:

```bash
git clone https://github.com/BurakYs/VidGet.git
cd VidGet

npm i -g pnpm

cd client && pnpm install
cd ../server && pnpm install
```

Now you have installed all the dependencies. Close the terminal and open 2 new ones. In the first terminal, run:

```bash
cd client
pnpm run dev
```

> Or if you want a faster website, run:
> ```bash
> cd client
> pnpm run build
> pnpm run preview
> ```

In the second terminal, run:

```bash
cd server
pnpm run launch
```

Now you can click the link in the first terminal to open the website.

## Staying Updated

To update the project, run the following commands:

```bash
cd VidGet
git pull
cd client && pnpm install
cd ../server && pnpm install
```

> [!IMPORTANT]
> Do not edit any file if you don't know how to use Git.
