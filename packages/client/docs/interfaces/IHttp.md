[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IHttp

# Interface: IHttp

## Table of contents

### Properties

- [latestResponse](IHttp.md#latestresponse)

### Methods

- [delete](IHttp.md#delete)
- [deleteJson](IHttp.md#deletejson)
- [get](IHttp.md#get)
- [getScript](IHttp.md#getscript)
- [isResponseError](IHttp.md#isresponseerror)
- [loadScript](IHttp.md#loadscript)
- [post](IHttp.md#post)
- [postFile](IHttp.md#postfile)
- [postJson](IHttp.md#postjson)
- [put](IHttp.md#put)
- [putJson](IHttp.md#putjson)
- [setCdn](IHttp.md#setcdn)

## Properties

### latestResponse

• `Readonly` **latestResponse**: [`IHttpResponse`](../modules.md#ihttpresponse)

Latest available HTTP response, valid during your get|post|put...then() and catch() handlers.

## Methods

### delete

▸ **delete**\<`T`, `R`\>(`url`, `params?`): `Promise`\<`R`\>

HTTP DELETE

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `params?` | [`IHttpParams`](../modules.md#ihttpparams) |

#### Returns

`Promise`\<`R`\>

___

### deleteJson

▸ **deleteJson**\<`T`, `R`\>(`url`, `json`): `Promise`\<`R`\>

HTTP DELETE, Accept: application/json

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `json` | `any` |

#### Returns

`Promise`\<`R`\>

___

### get

▸ **get**\<`R`\>(`url`, `params?`): `Promise`\<`R`\>

HTTP GET Accept: application/json

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `params?` | [`IHttpParams`](../modules.md#ihttpparams) |

#### Returns

`Promise`\<`R`\>

___

### getScript

▸ **getScript**\<`R`\>(`url`, `params?`, `exportedVariableName?`): `Promise`\<`R`\>

HTTP GET, Accept: application/javascript

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `params?` | [`IHttpParams`](../modules.md#ihttpparams) |
| `exportedVariableName?` | `string` |

#### Returns

`Promise`\<`R`\>

___

### isResponseError

▸ **isResponseError**(): `boolean`

Check if HTTP status of latestResponse is <200 or >=300

#### Returns

`boolean`

___

### loadScript

▸ **loadScript**(`url`, `params?`): `Promise`\<`void`\>

HTTP GET, Accept: application/javascript

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `params?` | [`IHttpParams`](../modules.md#ihttpparams) |

#### Returns

`Promise`\<`void`\>

___

### post

▸ **post**\<`R`\>(`url`, `data?`, `params?`): `Promise`\<`R`\>

HTTP POST, Accept: application/json

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data?` | `any` |
| `params?` | [`IHttpParams`](../modules.md#ihttpparams) |

#### Returns

`Promise`\<`R`\>

___

### postFile

▸ **postFile**\<`R`\>(`url`, `data`, `params?`): `Promise`\<`R`\>

HTTP POST

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | - |
| `data` | `any` | must be of one of the following types: string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams Browser only: FormData, File, Blob Node only: Stream, Buffer |
| `params?` | [`IHttpParams`](../modules.md#ihttpparams) | - |

#### Returns

`Promise`\<`R`\>

___

### postJson

▸ **postJson**\<`T`, `R`\>(`url`, `json`, `params?`): `Promise`\<`R`\>

HTTP POST, Accept: application/json, Content-type: application/json

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `json` | `any` |
| `params?` | [`IHttpParams`](../modules.md#ihttpparams) |

#### Returns

`Promise`\<`R`\>

___

### put

▸ **put**\<`T`, `R`\>(`url`, `data?`, `params?`): `Promise`\<`R`\>

HTTP PUT, Accept: application/json

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data?` | `any` |
| `params?` | [`IHttpParams`](../modules.md#ihttpparams) |

#### Returns

`Promise`\<`R`\>

___

### putJson

▸ **putJson**\<`T`, `R`\>(`url`, `json`, `params?`): `Promise`\<`R`\>

HTTP PUT, Accept: application/json, Content-type: application/json

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `json` | `any` |
| `params?` | [`IHttpParams`](../modules.md#ihttpparams) |

#### Returns

`Promise`\<`R`\>

___

### setCdn

▸ **setCdn**(`url`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`void`
