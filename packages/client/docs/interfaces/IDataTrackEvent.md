[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IDataTrackEvent

# Interface: IDataTrackEvent

Typing of tracked events on a DATA layer.

## Hierarchy

- [`ISubjectMessage`](ISubjectMessage.md)

  ↳ **`IDataTrackEvent`**

## Table of contents

### Properties

- [data](IDataTrackEvent.md#data)
- [name](IDataTrackEvent.md#name)

## Properties

### data

• **data**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `event-type` | `string` |
| `module?` | `string` |
| `userId?` | `string` |

#### Overrides

[ISubjectMessage](ISubjectMessage.md).[data](ISubjectMessage.md#data)

___

### name

• **name**: ``"track"``

#### Overrides

[ISubjectMessage](ISubjectMessage.md).[name](ISubjectMessage.md#name)
