[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IBehaviourService

# Interface: IBehaviourService

**`Deprecated`**

Used by the internal linker ONLY
Old-fashioned way of listing resources => `behaviours.loadResources()`

## Table of contents

### Methods

- [getApplication](IBehaviourService.md#getapplication)
- [getResourceType](IBehaviourService.md#getresourcetype)
- [loadResources](IBehaviourService.md#loadresources)

## Methods

### getApplication

▸ **getApplication**(): `string`

App providing this service.

#### Returns

`string`

___

### getResourceType

▸ **getResourceType**(): `string`

Type of resource this service can manage.

#### Returns

`string`

___

### loadResources

▸ **loadResources**(`parameters`): `Promise`\<[`ILinkedResource`](ILinkedResource.md)[]\>

Load resources.

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`GetContextParameters`](../modules.md#getcontextparameters) |

#### Returns

`Promise`\<[`ILinkedResource`](ILinkedResource.md)[]\>
