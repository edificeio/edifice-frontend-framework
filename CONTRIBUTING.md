# CONTRIBUTING

We are following [Semantic Versioning](https://semver.org/) and [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). <br/>
When contributing to this repository, please follow the steps below.

## Semantic Versioning Reminder

> PATCH: refactor, internal or non-breaking change which fixes an issue
>
> MINOR: non-breaking change which adds functionality
>
> MAJOR: fix or feature that would cause existing functionality to not work as expected

## Conventional Commits Reminder

Always try to add the library you've been working on between `()`

- For instance, if adding a new component in core package.

```bash
git commit -m "feat(core): adding a new component"
```

- For instance, if fixing an issue

```bash
git commit -m "fix(icons): change correct name to AddUser icon"
```

- If touching configuration

```bash
git commit -m "chore(dep): updating eslint configuration"
```

## Branches

We already have a `develop` branch created to work on packages.

---

⚠️ Don't use or push on `main` branch. This branch is used to merge and publish packages.

---

## Dev

- Before starting any development, please rebase the `develop` branch.
- Checkout to your own development branch if different from information above.
- Rebase this branch with `develop` branch.
- Start developing.
- Then, create a Pull Request.

## Documentation

Every public brick must be documented in Storybook. Which form to use depends on what
you are documenting.

**Components — a description in the story.**

Storybook runs with `autodocs` enabled globally, so every story already gets a Docs page
with its props table generated from the types. What the tooling cannot infer is the
narrative: what the component is for, how its props interact, when to reach for another
one. Add it to the story `meta`:

```tsx
const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    docs: {
      description: {
        component: 'What the component does, and when to use it.',
      },
    },
  },
};
```

Markdown is supported. Do not restate the props one by one — the table already does it.

**Hooks — an MDX page.**

A hook has no props table to generate, so it is documented in an `.mdx` file next to it,
with the sections `# useX`, `## Usage`, `## Parameters`, `## Returns` and `## Example`.

- **Without a visual demo** (the common case): a standalone page, declared with
  `<Meta title="Hooks/useX" />` and **no story**. Nothing is rendered, so it costs no
  Chromatic snapshot.
- **With a visual demo** (`useToast`, `useDropzone`, `useTrapFocus`…): add a story and
  attach the page to it with `<Meta of={useXStories} />`, then embed the demo where it
  belongs with `<Canvas of={useXStories.Example} />`. Such a story is a demo, not a
  design system visual to watch for regressions, so exclude it from Chromatic:

  ```tsx
  const meta: Meta<typeof useX> = {
    title: 'Hooks/useX',
    parameters: {
      chromatic: { disableSnapshot: true },
    },
  };
  ```

  The demo stays fully interactive in Storybook, it only leaves the snapshot scope.

When a page is attached this way it **replaces** the autodocs page, so do not also add a
`docs.description.component` to the story — the MDX carries the narrative.

**A component may use MDX too**, when the documentation needs long code samples or
several sections that would not fit in a description string.

Note: MDX tables require `remark-gfm`, already configured in
`apps/docs/.storybook/main.ts`. Without it they render as raw text.

Check your page with `pnpm docs:build`, or `pnpm docs` to browse it locally.

## Pull Request

- After pushing your work, create a Pull Request
- Select `develop` branch as base branch.
- Add a clear title if your commit message is not there.
- Leave a comment if desired
- Create your Pull Request and then fill the checkboxes of the Template
- Add a reviewer or two

## What's next ?

- Release Manager or Maintainer of Edifice UI will merge this PR.
- Packages will be updated on NPM.
