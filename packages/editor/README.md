# Edifice Rich Text Editor

This package is a wrapper around [Tiptap Editor](https://tiptap.dev/). It is plugged to the [@edifice.io/tiptap-extensions](https://www.npmjs.com/package/@edifice.io/tiptap-extensions) package and our [@edifice.io/multimedia](https://www.npmjs.com/package/@edifice.io/multimedia) components.

![npm](https://img.shields.io/npm/v/@edifice.io/editor?style=flat-square)
![bundlephobia](https://img.shields.io/bundlephobia/min/@edifice.io/editor?style=flat-square)

## Prerequisites

- `pnpm: >= 9`
- `node: >= 18`

## Getting Started

> [!IMPORTANT]
> To install this package, you need a Tiptap Token. Check official documentation for more information. [Tiptap Token](https://tiptap.dev/docs/guides/pro-extensions)

### Configuration

In your application, add this in your `.npmrc` file:

```bash
@tiptap-pro:registry=https://registry.tiptap.dev/
//registry.tiptap.dev/:_authToken=${TIPTAP_PRO_TOKEN}
```

### Install

```bash
pnpm add @edifice.io/editor
```
