[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IUserPreferences

# Interface: IUserPreferences

## Table of contents

### Properties

- [data](IUserPreferences.md#data)

### Methods

- [get](IUserPreferences.md#get)
- [load](IUserPreferences.md#load)
- [save](IUserPreferences.md#save)
- [update](IUserPreferences.md#update)

## Properties

### data

• **data**: `Object`

## Methods

### get

▸ **get**(`key`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`any`

___

### load

▸ **load**(`key`, `defaultTo?`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `defaultTo?` | `any` |

#### Returns

`Promise`\<`any`\>

___

### save

▸ **save**(`key`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`void`\>

___

### update

▸ **update**(`key`, `data`): [`IUserPreferences`](IUserPreferences.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `data` | `any` |

#### Returns

[`IUserPreferences`](IUserPreferences.md)
