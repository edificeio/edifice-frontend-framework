[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IReactionsService

# Interface: IReactionsService

## Table of contents

### Methods

- [createReaction](IReactionsService.md#createreaction)
- [deleteReaction](IReactionsService.md#deletereaction)
- [loadAvailableReactions](IReactionsService.md#loadavailablereactions)
- [loadReactionDetails](IReactionsService.md#loadreactiondetails)
- [loadReactionSummaries](IReactionsService.md#loadreactionsummaries)
- [updateReaction](IReactionsService.md#updatereaction)

## Methods

### createReaction

▸ **createReaction**(`resourceId`, `reactionType`): `Promise`\<`void`\>

Set the current user reaction to a resource.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resourceId` | `string` | id |
| `reactionType` | ``"REACTION_1"`` \| ``"REACTION_2"`` \| ``"REACTION_3"`` \| ``"REACTION_4"`` | reaction to set |

#### Returns

`Promise`\<`void`\>

___

### deleteReaction

▸ **deleteReaction**(`resourceId`): `Promise`\<`void`\>

Remove the current user reaction to a resource.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resourceId` | `string` | id |

#### Returns

`Promise`\<`void`\>

___

### loadAvailableReactions

▸ **loadAvailableReactions**(): `Promise`\<`undefined` \| (``"REACTION_1"`` \| ``"REACTION_2"`` \| ``"REACTION_3"`` \| ``"REACTION_4"``)[]\>

Load the list of available reactions types, which is configured on the platform.

#### Returns

`Promise`\<`undefined` \| (``"REACTION_1"`` \| ``"REACTION_2"`` \| ``"REACTION_3"`` \| ``"REACTION_4"``)[]\>

a list of types, or undefined if an error occured.

___

### loadReactionDetails

▸ **loadReactionDetails**(`resourceId`, `page`, `size`): `Promise`\<`undefined` \| [`ReactionDetailsData`](../modules.md#reactiondetailsdata)\>

Load the reactions details for a resource.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resourceId` | `string` | ID of the resource |
| `page` | `number` | Page number |
| `size` | `number` | Number of results per page. |

#### Returns

`Promise`\<`undefined` \| [`ReactionDetailsData`](../modules.md#reactiondetailsdata)\>

___

### loadReactionSummaries

▸ **loadReactionSummaries**(`resourceIds`): `Promise`\<\{ `[resourceId: string]`: [`ReactionSummaryData`](../modules.md#reactionsummarydata) \| `undefined`;  }\>

Load the reactions summary for a list of resources.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resourceIds` | `string`[] | list of resource ids |

#### Returns

`Promise`\<\{ `[resourceId: string]`: [`ReactionSummaryData`](../modules.md#reactionsummarydata) \| `undefined`;  }\>

map of summaries, indexed by resource id.

___

### updateReaction

▸ **updateReaction**(`resourceId`, `reactionType`): `Promise`\<`void`\>

Change the current user reaction to a resource.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resourceId` | `string` | id |
| `reactionType` | ``"REACTION_1"`` \| ``"REACTION_2"`` \| ``"REACTION_3"`` \| ``"REACTION_4"`` | reaction to set |

#### Returns

`Promise`\<`void`\>
