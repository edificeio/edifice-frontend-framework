[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IHttpErrorEvent

# Interface: IHttpErrorEvent

Typing of error messages on the TRANSPORT layer.

## Hierarchy

- [`ISubjectMessage`](ISubjectMessage.md)

  ↳ **`IHttpErrorEvent`**

## Table of contents

### Properties

- [data](IHttpErrorEvent.md#data)
- [name](IHttpErrorEvent.md#name)

## Properties

### data

• **data**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `params?` | [`IHttpParams`](../modules.md#ihttpparams) |
| `payload?` | `any` |
| `response` | [`IHttpResponse`](../modules.md#ihttpresponse) |

#### Overrides

[ISubjectMessage](ISubjectMessage.md).[data](ISubjectMessage.md#data)

___

### name

• **name**: ``"error"``

#### Overrides

[ISubjectMessage](ISubjectMessage.md).[name](ISubjectMessage.md#name)
