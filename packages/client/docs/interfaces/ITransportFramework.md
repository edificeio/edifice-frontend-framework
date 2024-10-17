[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / ITransportFramework

# Interface: ITransportFramework

## Table of contents

### Properties

- [http](ITransportFramework.md#http)

### Methods

- [newHttpInstance](ITransportFramework.md#newhttpinstance)

## Properties

### http

• `Readonly` **http**: [`IHttp`](IHttp.md)

Default instance.

## Methods

### newHttpInstance

▸ **newHttpInstance**(`params?`): [`IHttp`](IHttp.md)

Creates a new IHttp object with a custom configuration;

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params?` | `any` | see available options at https://axios-http.com/docs/req_config |

#### Returns

[`IHttp`](IHttp.md)
