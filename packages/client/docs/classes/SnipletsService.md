[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / SnipletsService

# Class: SnipletsService

## Table of contents

### Constructors

- [constructor](SnipletsService.md#constructor)

### Properties

- [findBehaviour](SnipletsService.md#findbehaviour)
- [hasBehaviour](SnipletsService.md#hasbehaviour)
- [resourceProducingApps](SnipletsService.md#resourceproducingapps)

### Methods

- [initialize](SnipletsService.md#initialize)
- [registerBehaviours](SnipletsService.md#registerbehaviours)

## Constructors

### constructor

• **new SnipletsService**(): [`SnipletsService`](SnipletsService.md)

#### Returns

[`SnipletsService`](SnipletsService.md)

## Properties

### findBehaviour

▪ `Static` **findBehaviour**: (`lookFor`: \{ `application`: `string` ; `resourceType`: `string`  }, `context`: `IOdeServices`) => [`IBehaviourService`](../interfaces/IBehaviourService.md)

#### Type declaration

▸ (`lookFor`, `context`): [`IBehaviourService`](../interfaces/IBehaviourService.md)

Lookup for a service

##### Parameters

| Name | Type |
| :------ | :------ |
| `lookFor` | `Object` |
| `lookFor.application` | `string` |
| `lookFor.resourceType` | `string` |
| `context` | `IOdeServices` |

##### Returns

[`IBehaviourService`](../interfaces/IBehaviourService.md)

___

### hasBehaviour

▪ `Static` **hasBehaviour**: (`__namedParameters`: \{ `application`: `string` ; `resourceType`: `string`  }) => `boolean`

#### Type declaration

▸ (`«destructured»`): `boolean`

Check if a service is registered.

##### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `application` | `string` |
| › `resourceType` | `string` |

##### Returns

`boolean`

___

### resourceProducingApps

▪ `Static` **resourceProducingApps**: `string`[] = `[]`

## Methods

### initialize

▸ **initialize**(`context`, `currentApp`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `IOdeServices` |
| `currentApp` | `string` |

#### Returns

`Promise`\<`string`[]\>

___

### registerBehaviours

▸ **registerBehaviours**(`currentApp`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `currentApp` | `string` |

#### Returns

`Promise`\<`void`\>
