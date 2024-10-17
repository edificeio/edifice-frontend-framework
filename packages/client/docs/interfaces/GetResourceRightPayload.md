[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / GetResourceRightPayload

# Interface: GetResourceRightPayload

Payload of shared resource

## Table of contents

### Properties

- [actions](GetResourceRightPayload.md#actions)
- [groups](GetResourceRightPayload.md#groups)
- [users](GetResourceRightPayload.md#users)

## Properties

### actions

• **actions**: \{ `displayName`: `string` ; `name`: `string`[] ; `type`: ``"RESOURCE"``  }[]

___

### groups

• **groups**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `checked` | `Record`\<`string`, `string`[]\> |
| `visibles` | \{ `groupDisplayName`: `string` ; `id`: `string` ; `name`: `string` ; `structureName`: `string`  }[] |

___

### users

• **users**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `checked` | `Record`\<`string`, `string`[]\> |
| `visibles` | \{ `firstName`: `string` ; `id`: `string` ; `lastName`: `string` ; `login`: `string` ; `profile`: `string` ; `username`: `string`  }[] |
