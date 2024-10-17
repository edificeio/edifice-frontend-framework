[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / DocumentHelper

# Class: DocumentHelper

## Table of contents

### Constructors

- [constructor](DocumentHelper.md#constructor)

### Methods

- [getRole](DocumentHelper.md#getrole)
- [role](DocumentHelper.md#role)

## Constructors

### constructor

• **new DocumentHelper**(): [`DocumentHelper`](DocumentHelper.md)

#### Returns

[`DocumentHelper`](DocumentHelper.md)

## Methods

### getRole

▸ **getRole**(`doc`): ``"video"`` \| ``"txt"`` \| ``"md"`` \| ``"doc"`` \| ``"xls"`` \| ``"ppt"`` \| ``"csv"`` \| ``"img"`` \| ``"pdf"`` \| ``"audio"`` \| ``"zip"`` \| ``"unknown"``

#### Parameters

| Name | Type |
| :------ | :------ |
| `doc` | [`WorkspaceElement`](../interfaces/WorkspaceElement.md) |

#### Returns

``"video"`` \| ``"txt"`` \| ``"md"`` \| ``"doc"`` \| ``"xls"`` \| ``"ppt"`` \| ``"csv"`` \| ``"img"`` \| ``"pdf"`` \| ``"audio"`` \| ``"zip"`` \| ``"unknown"``

___

### role

▸ **role**(`contentType`, `previewRole?`, `extension?`): ``"video"`` \| ``"txt"`` \| ``"md"`` \| ``"doc"`` \| ``"xls"`` \| ``"ppt"`` \| ``"csv"`` \| ``"img"`` \| ``"pdf"`` \| ``"audio"`` \| ``"zip"`` \| ``"unknown"``

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `contentType` | `undefined` \| `string` | `undefined` |
| `previewRole` | `boolean` | `false` |
| `extension?` | `string` | `undefined` |

#### Returns

``"video"`` \| ``"txt"`` \| ``"md"`` \| ``"doc"`` \| ``"xls"`` \| ``"ppt"`` \| ``"csv"`` \| ``"img"`` \| ``"pdf"`` \| ``"audio"`` \| ``"zip"`` \| ``"unknown"``
