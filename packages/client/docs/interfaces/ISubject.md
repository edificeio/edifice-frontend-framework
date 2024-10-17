[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / ISubject

# Interface: ISubject

Generic typing of a subject.

## Table of contents

### Methods

- [publish](ISubject.md#publish)
- [subscribe](ISubject.md#subscribe)

## Methods

### publish

▸ **publish**(`layer`, `message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `layer` | `Omit`\<[`LayerName`](../modules.md#layername), ``"transport"`` \| ``"webDataPipeline"``\> |
| `message` | [`ISubjectMessage`](ISubjectMessage.md) |

#### Returns

`void`

▸ **publish**(`layer`, `message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `layer` | ``"transport"`` |
| `message` | [`IHttpErrorEvent`](IHttpErrorEvent.md) |

#### Returns

`void`

▸ **publish**(`layer`, `message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `layer` | ``"webDataPipeline"`` |
| `message` | [`IDataTrackEvent`](IDataTrackEvent.md) |

#### Returns

`void`

___

### subscribe

▸ **subscribe**(`layer`, `handler`): [`ISubscription`](ISubscription.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `layer` | `Omit`\<[`LayerName`](../modules.md#layername), ``"transport"`` \| ``"webDataPipeline"``\> |
| `handler` | \<T\>(`message`: `T`) => `void` |

#### Returns

[`ISubscription`](ISubscription.md)

▸ **subscribe**(`layer`, `handler`): [`ISubscription`](ISubscription.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `layer` | ``"transport"`` |
| `handler` | (`message`: [`IHttpErrorEvent`](IHttpErrorEvent.md)) => `void` |

#### Returns

[`ISubscription`](ISubscription.md)

▸ **subscribe**(`layer`, `handler`): [`ISubscription`](ISubscription.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `layer` | ``"webDataPipeline"`` |
| `handler` | (`message`: [`IDataTrackEvent`](IDataTrackEvent.md)) => `void` |

#### Returns

[`ISubscription`](ISubscription.md)
