# Edifice Storybook

## Getting Started

[Start With Storybook](https://storybook.js.org/tutorials/intro-to-storybook/react/fr/get-started/)

### Components Stories

[How To Write Stories](https://storybook.js.org/docs/react/writing-stories/introduction)

Storybook will search for `*.stories.tsx` files inside each package.

### MDX Pages

[How To Write MDX](https://storybook.js.org/docs/react/writing-docs/mdx)

For specific MDX documentation, you must write them inside `stories` folder from Storybook

`E.g: storybook/src/stories/Introduction.stories.mdx`

### Dev

> Start Storybook on port 6006

```bash
pnpm run docs
```

### Build

> Build storybook document to `dist/` folder

```bash
pnpm run docs:build
```

### Preview

```bash
pnpm run docs:preview
```

⚠️ Don't change output folder. This is used to deploy to Vercel.
