[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IIdiom

# Interface: IIdiom

## Table of contents

### Methods

- [addAllTranslations](IIdiom.md#addalltranslations)
- [addBundle](IIdiom.md#addbundle)
- [addBundlePromise](IIdiom.md#addbundlepromise)
- [addKeys](IIdiom.md#addkeys)
- [addTranslations](IIdiom.md#addtranslations)
- [removeAccents](IIdiom.md#removeaccents)
- [translate](IIdiom.md#translate)

## Methods

### addAllTranslations

▸ **addAllTranslations**(`folders`): `Promise`\<`void`\>

Load the JSON language files from many given folders, using the current user's language, then return a Promise.

#### Parameters

| Name | Type |
| :------ | :------ |
| `folders` | `string`[] |

#### Returns

`Promise`\<`void`\>

___

### addBundle

▸ **addBundle**(`path`, `callback?`): `void`

Load a language bundle then call an optional callback.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `callback?` | [`AddBundleCallback`](../modules.md#addbundlecallback) |

#### Returns

`void`

___

### addBundlePromise

▸ **addBundlePromise**(`path`): `Promise`\<`void`\>

Load a language bundle then return a Promise.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`\<`void`\>

___

### addKeys

▸ **addKeys**(`keys`): `void`

Add new key/values translations to the in-memory dictionary, using a key/value map. Existing in-memory keys ARE NOT REPLACED. Only new ones are added.

#### Parameters

| Name | Type |
| :------ | :------ |
| `keys` | `any` |

#### Returns

`void`

___

### addTranslations

▸ **addTranslations**(`folder`, `callback?`): `void`

Load the JSON language file from a given folder, using the current user's language, then call an optional callback.

#### Parameters

| Name | Type |
| :------ | :------ |
| `folder` | `string` |
| `callback?` | [`AddBundleCallback`](../modules.md#addbundlecallback) |

#### Returns

`void`

___

### removeAccents

▸ **removeAccents**(`str`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

a new string without accentuation.

___

### translate

▸ **translate**(`key`, `params?`): `string`

Get the translation of a given key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | - |
| `params?` | `Object` | (optional) map of key/value variables. |

#### Returns

`string`

the key itself when no translation exists.
