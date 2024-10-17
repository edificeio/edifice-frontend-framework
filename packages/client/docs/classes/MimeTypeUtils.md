[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / MimeTypeUtils

# Class: MimeTypeUtils

## Table of contents

### Constructors

- [constructor](MimeTypeUtils.md#constructor)

### Properties

- [OCTET\_STREAM](MimeTypeUtils.md#octet_stream)
- [PDF](MimeTypeUtils.md#pdf)
- [INSTANCE](MimeTypeUtils.md#instance)

### Methods

- [getContentTypeForExtension](MimeTypeUtils.md#getcontenttypeforextension)
- [getExtensionForContentType](MimeTypeUtils.md#getextensionforcontenttype)
- [isCsvLike](MimeTypeUtils.md#iscsvlike)
- [isExcelLike](MimeTypeUtils.md#isexcellike)
- [isMdLike](MimeTypeUtils.md#ismdlike)
- [isPowerpointLike](MimeTypeUtils.md#ispowerpointlike)
- [isTxtLike](MimeTypeUtils.md#istxtlike)
- [isWordLike](MimeTypeUtils.md#iswordlike)

## Constructors

### constructor

• **new MimeTypeUtils**(): [`MimeTypeUtils`](MimeTypeUtils.md)

#### Returns

[`MimeTypeUtils`](MimeTypeUtils.md)

## Properties

### OCTET\_STREAM

• **OCTET\_STREAM**: `string` = `'application/octet-stream'`

___

### PDF

• **PDF**: `string` = `'application/pdf'`

___

### INSTANCE

▪ `Static` **INSTANCE**: [`MimeTypeUtils`](MimeTypeUtils.md)

## Methods

### getContentTypeForExtension

▸ **getContentTypeForExtension**(`extension`): ``null`` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `extension` | `string` |

#### Returns

``null`` \| `string`

___

### getExtensionForContentType

▸ **getExtensionForContentType**(`contentType`): ``null`` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | `string` |

#### Returns

``null`` \| `string`

___

### isCsvLike

▸ **isCsvLike**(`contentType`, `originalExt?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | `string` |
| `originalExt?` | `string` |

#### Returns

`boolean`

___

### isExcelLike

▸ **isExcelLike**(`contentType`, `originalExt?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | `string` |
| `originalExt?` | `string` |

#### Returns

`boolean`

___

### isMdLike

▸ **isMdLike**(`contentType`, `originalExt?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | `string` |
| `originalExt?` | `string` |

#### Returns

`boolean`

___

### isPowerpointLike

▸ **isPowerpointLike**(`contentType`, `originalExt?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | `string` |
| `originalExt?` | `string` |

#### Returns

`boolean`

___

### isTxtLike

▸ **isTxtLike**(`contentType`, `originalExt?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | `string` |
| `originalExt?` | `string` |

#### Returns

`boolean`

___

### isWordLike

▸ **isWordLike**(`contentType`, `originalExt?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | `string` |
| `originalExt?` | `string` |

#### Returns

`boolean`
