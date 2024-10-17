[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IResourceService

# Interface: IResourceService

Resources management service.
Resources are assets created or imported in the whole solution (core and non-core apps)

## Table of contents

### Methods

- [copy](IResourceService.md#copy)
- [create](IResourceService.md#create)
- [createContext](IResourceService.md#createcontext)
- [createFolder](IResourceService.md#createfolder)
- [deleteAll](IResourceService.md#deleteall)
- [getApplication](IResourceService.md#getapplication)
- [getResourceType](IResourceService.md#getresourcetype)
- [listSubfolders](IResourceService.md#listsubfolders)
- [moveToFolder](IResourceService.md#movetofolder)
- [publish](IResourceService.md#publish)
- [restoreAll](IResourceService.md#restoreall)
- [searchContext](IResourceService.md#searchcontext)
- [searchResource](IResourceService.md#searchresource)
- [trashAll](IResourceService.md#trashall)
- [update](IResourceService.md#update)
- [updateFolder](IResourceService.md#updatefolder)

## Methods

### copy

▸ **copy**\<`T`\>(`parameters`): `Promise`\<[`CopyResult`](CopyResult.md)\>

Copy a resource from common parameters.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CopyParameters`](CopyParameters.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `T` |

#### Returns

`Promise`\<[`CopyResult`](CopyResult.md)\>

___

### create

▸ **create**\<`T`\>(`parameters`): `Promise`\<[`CreateResult`](CreateResult.md)\>

Create a new resource from common parameters.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CreateParameters`](CreateParameters.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `T` |

#### Returns

`Promise`\<[`CreateResult`](CreateResult.md)\>

___

### createContext

▸ **createContext**(`parameters`): `Promise`\<[`GetContextResult`](../modules.md#getcontextresult)\>

Create a search context and get the first results page.

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`GetContextParameters`](../modules.md#getcontextparameters) |

#### Returns

`Promise`\<[`GetContextResult`](../modules.md#getcontextresult)\>

___

### createFolder

▸ **createFolder**(`parameters`): `Promise`\<[`CreateFolderResult`](CreateFolderResult.md)\>

Create a new folder.

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`CreateFolderParameters`](CreateFolderParameters.md) |

#### Returns

`Promise`\<[`CreateFolderResult`](CreateFolderResult.md)\>

___

### deleteAll

▸ **deleteAll**(`parameters`, `useAssetId?`): `Promise`\<[`IActionResult`](IActionResult.md)\>

Delete folders and/or resources.

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`DeleteParameters`](DeleteParameters.md) |
| `useAssetId?` | `boolean` |

#### Returns

`Promise`\<[`IActionResult`](IActionResult.md)\>

___

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

### listSubfolders

▸ **listSubfolders**(`folderId`): `Promise`\<[`GetSubFoldersResult`](GetSubFoldersResult.md)\>

List subfolders of a parent folder.

#### Parameters

| Name | Type |
| :------ | :------ |
| `folderId` | `string` |

#### Returns

`Promise`\<[`GetSubFoldersResult`](GetSubFoldersResult.md)\>

___

### moveToFolder

▸ **moveToFolder**(`parameters`, `useAssetId?`): `Promise`\<[`IActionResult`](IActionResult.md)\>

Move resources/folders to a folder.

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`MoveParameters`](MoveParameters.md) |
| `useAssetId?` | `boolean` |

#### Returns

`Promise`\<[`IActionResult`](IActionResult.md)\>

___

### publish

▸ **publish**(`parameters`): `Promise`\<[`PublishResult`](PublishResult.md)\>

Publish an resource

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`PublishParameters`](PublishParameters.md) |

#### Returns

`Promise`\<[`PublishResult`](PublishResult.md)\>

___

### restoreAll

▸ **restoreAll**(`parameters`, `useAssetId?`): `Promise`\<[`IActionResult`](IActionResult.md)\>

Restore folders and/or resources from trash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`DeleteParameters`](DeleteParameters.md) |
| `useAssetId?` | `boolean` |

#### Returns

`Promise`\<[`IActionResult`](IActionResult.md)\>

___

### searchContext

▸ **searchContext**(`parameters`): `Promise`\<[`ISearchResults`](ISearchResults.md)\>

Search / paginate within a search context.

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`GetContextParameters`](../modules.md#getcontextparameters) |

#### Returns

`Promise`\<[`ISearchResults`](ISearchResults.md)\>

___

### searchResource

▸ **searchResource**(`parameters`): `Promise`\<[`IResource`](IResource.md)\>

Search 1 resource by `id`

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`GetResourceParameters`](../modules.md#getresourceparameters) |

#### Returns

`Promise`\<[`IResource`](IResource.md)\>

___

### trashAll

▸ **trashAll**(`parameters`, `useAssetId?`): `Promise`\<[`IActionResult`](IActionResult.md)\>

Trash folders and/or resources.

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`DeleteParameters`](DeleteParameters.md) |
| `useAssetId?` | `boolean` |

#### Returns

`Promise`\<[`IActionResult`](IActionResult.md)\>

___

### update

▸ **update**\<`T`\>(`parameters`): `Promise`\<[`UpdateResult`](UpdateResult.md)\>

Update an existing resource from common parameters.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`UpdateParameters`](UpdateParameters.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `T` |

#### Returns

`Promise`\<[`UpdateResult`](UpdateResult.md)\>

___

### updateFolder

▸ **updateFolder**(`parameters`): `Promise`\<[`CreateFolderResult`](CreateFolderResult.md)\>

Update folder.

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`UpdateFolderParameters`](UpdateFolderParameters.md) |

#### Returns

`Promise`\<[`CreateFolderResult`](CreateFolderResult.md)\>
