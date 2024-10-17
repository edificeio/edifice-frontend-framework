[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / ISessionFramework

# Interface: ISessionFramework

## Table of contents

### Properties

- [session](ISessionFramework.md#session)

### Methods

- [initialize](ISessionFramework.md#initialize)
- [login](ISessionFramework.md#login)
- [logout](ISessionFramework.md#logout)

## Properties

### session

• **session**: [`ISession`](ISession.md)

The current user session.

## Methods

### initialize

▸ **initialize**(): `Promise`\<`void`\>

Initialize once before use.

#### Returns

`Promise`\<`void`\>

___

### login

▸ **login**(`email`, `password`, `rememberMe?`, `secureLocation?`): `Promise`\<`void`\>

Log the current user in.

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |
| `password` | `string` |
| `rememberMe?` | `boolean` |
| `secureLocation?` | `boolean` |

#### Returns

`Promise`\<`void`\>

___

### logout

▸ **logout**(): `Promise`\<`void`\>

Close the current user session.

#### Returns

`Promise`\<`void`\>
