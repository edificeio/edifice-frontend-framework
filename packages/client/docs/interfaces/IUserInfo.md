[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IUserInfo

# Interface: IUserInfo

## Table of contents

### Properties

- [apps](IUserInfo.md#apps)
- [authorizedActions](IUserInfo.md#authorizedactions)
- [birthDate](IUserInfo.md#birthdate)
- [children](IUserInfo.md#children)
- [childrenIds](IUserInfo.md#childrenids)
- [classNames](IUserInfo.md#classnames)
- [classes](IUserInfo.md#classes)
- [deletePending](IUserInfo.md#deletepending)
- [externalId](IUserInfo.md#externalid)
- [federated](IUserInfo.md#federated)
- [federatedIDP](IUserInfo.md#federatedidp)
- [firstName](IUserInfo.md#firstname)
- [forceChangePassword](IUserInfo.md#forcechangepassword)
- [functions](IUserInfo.md#functions)
- [groupsIds](IUserInfo.md#groupsids)
- [hasApp](IUserInfo.md#hasapp)
- [hasPw](IUserInfo.md#haspw)
- [lastName](IUserInfo.md#lastname)
- [level](IUserInfo.md#level)
- [login](IUserInfo.md#login)
- [needRevalidateTerms](IUserInfo.md#needrevalidateterms)
- [optionEnabled](IUserInfo.md#optionenabled)
- [preferences](IUserInfo.md#preferences)
- [sessionMetadata](IUserInfo.md#sessionmetadata)
- [structureNames](IUserInfo.md#structurenames)
- [structures](IUserInfo.md#structures)
- [type](IUserInfo.md#type)
- [uai](IUserInfo.md#uai)
- [userId](IUserInfo.md#userid)
- [username](IUserInfo.md#username)
- [widgets](IUserInfo.md#widgets)

## Properties

### apps

• **apps**: [`IWebApp`](IWebApp.md)[]

___

### authorizedActions

• **authorizedActions**: [`IWorkflowAuth`](IWorkflowAuth.md)[]

___

### birthDate

• **birthDate**: `string`

___

### children

• **children**: `any`

___

### childrenIds

• **childrenIds**: `string`[]

___

### classNames

• **classNames**: `string`[]

___

### classes

• **classes**: `any`[]

___

### deletePending

• **deletePending**: `boolean`

___

### externalId

• **externalId**: `string`

___

### federated

• `Optional` **federated**: `any`

___

### federatedIDP

• `Optional` **federatedIDP**: `any`

___

### firstName

• **firstName**: `string`

___

### forceChangePassword

• `Optional` **forceChangePassword**: `any`

___

### functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ADMIN_LOCAL?` | \{ `code`: `string` ; `scope`: `string`[]  } |
| `ADMIN_LOCAL.code` | `string` |
| `ADMIN_LOCAL.scope` | `string`[] |
| `SUPER_ADMIN` | \{ `code`: `string` ; `scope`: `string`[]  } |
| `SUPER_ADMIN.code` | `string` |
| `SUPER_ADMIN.scope` | `string`[] |

___

### groupsIds

• **groupsIds**: `string`[]

___

### hasApp

• **hasApp**: `boolean`

___

### hasPw

• **hasPw**: `boolean`

___

### lastName

• **lastName**: `string`

___

### level

• **level**: `string`

___

### login

• **login**: `string`

___

### needRevalidateTerms

• **needRevalidateTerms**: `any`

___

### optionEnabled

• **optionEnabled**: `any`[]

___

### preferences

• `Optional` **preferences**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `save` | (`pref`: `any`, `data`: `any`) => `void` |

___

### sessionMetadata

• **sessionMetadata**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `userId` | `string` |

___

### structureNames

• **structureNames**: `string`[]

___

### structures

• **structures**: `string`[]

___

### type

• **type**: ``"ELEVE"`` \| ``"ENSEIGNANT"`` \| ``"PERSRELELEVE"`` \| ``"SUPERADMIN"`` \| ``"PERSEDUCNAT"``

___

### uai

• **uai**: `any`[]

___

### userId

• **userId**: `string`

___

### username

• **username**: `string`

___

### widgets

• **widgets**: [`IWidgetModel`](IWidgetModel.md)[]
