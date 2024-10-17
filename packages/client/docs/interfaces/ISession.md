[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / ISession

# Interface: ISession

## Table of contents

### Properties

- [avatarUrl](ISession.md#avatarurl)
- [currentApp](ISession.md#currentapp)
- [currentLanguage](ISession.md#currentlanguage)
- [description](ISession.md#description)
- [latestQuotaAndUsage](ISession.md#latestquotaandusage)
- [notLoggedIn](ISession.md#notloggedin)
- [profile](ISession.md#profile)
- [user](ISession.md#user)

### Methods

- [checkEmail](ISession.md#checkemail)
- [checkMobile](ISession.md#checkmobile)
- [getEmailValidationInfos](ISession.md#getemailvalidationinfos)
- [getMfaInfos](ISession.md#getmfainfos)
- [getMobileValidationInfos](ISession.md#getmobilevalidationinfos)
- [getUserProfile](ISession.md#getuserprofile)
- [hasRight](ISession.md#hasright)
- [hasWorkflow](ISession.md#hasworkflow)
- [tryEmailValidation](ISession.md#tryemailvalidation)
- [tryMfaCode](ISession.md#trymfacode)
- [tryMobileValidation](ISession.md#trymobilevalidation)

## Properties

### avatarUrl

• `Readonly` **avatarUrl**: `string`

Get the connected user's avatar URL, or a default one.
Append a query parameter to this URL for it to get resized, for example "?thumbnail=48x48"

___

### currentApp

• `Readonly` **currentApp**: ``null`` \| `string`

Retrieve the current main app,

**`See`**

ConfigureFramework.Platform.apps

___

### currentLanguage

• `Readonly` **currentLanguage**: `string`

Language code (2-letters) actually applied.

___

### description

• `Readonly` **description**: [`IUserDescription`](IUserDescription.md)

Additional information about the connected user.

___

### latestQuotaAndUsage

• `Readonly` **latestQuotaAndUsage**: `Promise`\<[`IQuotaAndUsage`](IQuotaAndUsage.md)\>

Retrieve the lastest storage + quota information.

___

### notLoggedIn

• `Readonly` **notLoggedIn**: `boolean`

Truthy when no user is connected.

___

### profile

• `Readonly` **profile**: [`UserProfile`](../modules.md#userprofile)

Additional profile user information.

___

### user

• `Readonly` **user**: [`IUserInfo`](IUserInfo.md)

Basic information about the connected user.

## Methods

### checkEmail

▸ **checkEmail**(`email`): `Promise`\<`void`\>

Send a 6-digits code to an email address to validate it.
=> when resolved successfully, the email validation infos will switch to the "pending" state.

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `String` |

#### Returns

`Promise`\<`void`\>

___

### checkMobile

▸ **checkMobile**(`mobile`): `Promise`\<`void`\>

Send a 6-digits code to a phone number to validate it.
=> when resolved successfully, the phone number infos will switch to the "pending" state.

#### Parameters

| Name | Type |
| :------ | :------ |
| `mobile` | `String` |

#### Returns

`Promise`\<`void`\>

___

### getEmailValidationInfos

▸ **getEmailValidationInfos**(): `Promise`\<[`IEmailValidationInfos`](IEmailValidationInfos.md)\>

Verify if the logged-in user has a valid email address.

#### Returns

`Promise`\<[`IEmailValidationInfos`](IEmailValidationInfos.md)\>

___

### getMfaInfos

▸ **getMfaInfos**(): `Promise`\<[`IMfaInfos`](IMfaInfos.md)\>

Start an MFA for the logged-in user, unless already pending or done.

#### Returns

`Promise`\<[`IMfaInfos`](IMfaInfos.md)\>

___

### getMobileValidationInfos

▸ **getMobileValidationInfos**(): `Promise`\<[`IMobileValidationInfos`](IMobileValidationInfos.md)\>

Verify if the logged-in user has a valid phone number.

#### Returns

`Promise`\<[`IMobileValidationInfos`](IMobileValidationInfos.md)\>

___

### getUserProfile

▸ **getUserProfile**(): `Promise`\<[`UserProfile`](../modules.md#userprofile)\>

Get User Profile

#### Returns

`Promise`\<[`UserProfile`](../modules.md#userprofile)\>

___

### hasRight

▸ **hasRight**(`resource`, `right`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `resource` | `any` |
| `right` | `any` |

#### Returns

`boolean`

___

### hasWorkflow

▸ **hasWorkflow**(`workflowName`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `workflowName` | `string` |

#### Returns

`boolean`

___

### tryEmailValidation

▸ **tryEmailValidation**(`code`): `Promise`\<[`IEmailValidationState`](IEmailValidationState.md)\>

Send a 6-digits code to the server to try validating the pending email address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `String` |

#### Returns

`Promise`\<[`IEmailValidationState`](IEmailValidationState.md)\>

___

### tryMfaCode

▸ **tryMfaCode**(`code`): `Promise`\<[`IMfaCodeState`](IMfaCodeState.md)\>

Send a 6-digits code to the server to validate a pending MFA.

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `String` |

#### Returns

`Promise`\<[`IMfaCodeState`](IMfaCodeState.md)\>

___

### tryMobileValidation

▸ **tryMobileValidation**(`code`): `Promise`\<[`IMobileValidationState`](IMobileValidationState.md)\>

Send a 6-digits code to the server to try validating the pending phone number.

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `String` |

#### Returns

`Promise`\<[`IMobileValidationState`](IMobileValidationState.md)\>
