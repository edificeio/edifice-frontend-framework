[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IViewsService

# Interface: IViewsService

## Table of contents

### Methods

- [getCounters](IViewsService.md#getcounters)
- [getDetails](IViewsService.md#getdetails)
- [trigger](IViewsService.md#trigger)

## Methods

### getCounters

▸ **getCounters**(`resourceIds`): `Promise`\<[`ViewsCounters`](../modules.md#viewscounters)\>

Load the views counter for a list of resources.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resourceIds` | `string`[] | list of resource ids |

#### Returns

`Promise`\<[`ViewsCounters`](../modules.md#viewscounters)\>

map of counters, indexed by resource id.

___

### getDetails

▸ **getDetails**(`resourceId`): `Promise`\<`undefined` \| [`ViewsDetails`](ViewsDetails.md)\>

Load the views details for a resource.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resourceId` | `string` | ID of the resource |

#### Returns

`Promise`\<`undefined` \| [`ViewsDetails`](ViewsDetails.md)\>

detailed views counters, or `undefined` if an error occured.

___

### trigger

▸ **trigger**(`resourceId`): `Promise`\<`void`\>

Trigger a view for a resource.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resourceId` | `string` | id |

#### Returns

`Promise`\<`void`\>
