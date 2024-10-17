[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / WorkspaceElement

# Interface: WorkspaceElement

## Table of contents

### Properties

- [\_id](WorkspaceElement.md#_id)
- [\_isShared](WorkspaceElement.md#_isshared)
- [\_shared](WorkspaceElement.md#_shared)
- [alt](WorkspaceElement.md#alt)
- [application](WorkspaceElement.md#application)
- [children](WorkspaceElement.md#children)
- [comment](WorkspaceElement.md#comment)
- [comments](WorkspaceElement.md#comments)
- [created](WorkspaceElement.md#created)
- [currentQuality](WorkspaceElement.md#currentquality)
- [deleted](WorkspaceElement.md#deleted)
- [eParent](WorkspaceElement.md#eparent)
- [eType](WorkspaceElement.md#etype)
- [editing](WorkspaceElement.md#editing)
- [externalId](WorkspaceElement.md#externalid)
- [file](WorkspaceElement.md#file)
- [hiddenBlob](WorkspaceElement.md#hiddenblob)
- [icon](WorkspaceElement.md#icon)
- [inheritedShares](WorkspaceElement.md#inheritedshares)
- [legend](WorkspaceElement.md#legend)
- [link](WorkspaceElement.md#link)
- [metadata](WorkspaceElement.md#metadata)
- [name](WorkspaceElement.md#name)
- [owner](WorkspaceElement.md#owner)
- [ownerName](WorkspaceElement.md#ownername)
- [protected](WorkspaceElement.md#protected)
- [public](WorkspaceElement.md#public)
- [showComments](WorkspaceElement.md#showcomments)
- [thumbnails](WorkspaceElement.md#thumbnails)
- [title](WorkspaceElement.md#title)
- [trasher](WorkspaceElement.md#trasher)
- [uploadStatus](WorkspaceElement.md#uploadstatus)
- [uploadXhr](WorkspaceElement.md#uploadxhr)
- [version](WorkspaceElement.md#version)

## Properties

### \_id

• `Optional` **\_id**: `string`

___

### \_isShared

• **\_isShared**: `boolean`

___

### \_shared

• **\_shared**: `any`[]

___

### alt

• `Optional` **alt**: `string`

___

### application

• `Optional` **application**: `string`

___

### children

• **children**: [`WorkspaceElement`](WorkspaceElement.md)[]

___

### comment

• `Optional` **comment**: `string`

___

### comments

• `Optional` **comments**: `Comment`[]

___

### created

• **created**: `Date`

___

### currentQuality

• `Optional` **currentQuality**: `number`

___

### deleted

• `Optional` **deleted**: `boolean`

___

### eParent

• **eParent**: `string`

___

### eType

• **eType**: `string`

___

### editing

• `Optional` **editing**: `boolean`

___

### externalId

• `Optional` **externalId**: `string`

___

### file

• `Optional` **file**: `string`

___

### hiddenBlob

• `Optional` **hiddenBlob**: `Blob`

___

### icon

• `Optional` **icon**: `string`

___

### inheritedShares

• `Optional` **inheritedShares**: `any`[]

___

### legend

• `Optional` **legend**: `string`

___

### link

• `Optional` **link**: `string`

___

### metadata

• `Optional` **metadata**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `captation?` | `boolean` |
| `content-type?` | `string` |
| `duration?` | `number` |
| `extension?` | `string` |
| `filename?` | `string` |
| `height?` | `number` |
| `role?` | `string` |
| `size?` | `number` |
| `width?` | `number` |

___

### name

• **name**: `string`

___

### owner

• **owner**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `displayName` | `string` |
| `userId` | `string` |

___

### ownerName

• `Optional` **ownerName**: `string`

___

### protected

• `Optional` **protected**: `boolean`

___

### public

• `Optional` **public**: `boolean`

___

### showComments

• `Optional` **showComments**: `boolean`

___

### thumbnails

• `Optional` **thumbnails**: `Object`

Get multimedia thumbnails

#### Index signature

▪ [thumbSize: `string`]: `string`

___

### title

• `Optional` **title**: `string`

___

### trasher

• `Optional` **trasher**: `string`

___

### uploadStatus

• `Optional` **uploadStatus**: ``"failed"`` \| ``"loading"`` \| ``"loaded"`` \| ``"abort"``

___

### uploadXhr

• `Optional` **uploadXhr**: `XMLHttpRequest`

___

### version

• `Optional` **version**: `number`
