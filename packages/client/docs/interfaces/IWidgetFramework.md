[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IWidgetFramework

# Interface: IWidgetFramework

## Table of contents

### Properties

- [list](IWidgetFramework.md#list)

### Methods

- [initialize](IWidgetFramework.md#initialize)
- [lookup](IWidgetFramework.md#lookup)
- [saveUserPrefs](IWidgetFramework.md#saveuserprefs)

## Properties

### list

• `Readonly` **list**: [`IWidget`](IWidget.md)[]

List widgets that are visible to the connected user.

## Methods

### initialize

▸ **initialize**(`version`, `cdnDomain`): `Promise`\<`void`\>

Loads the widget configuration.

#### Parameters

| Name | Type |
| :------ | :------ |
| `version` | ``null`` \| `string` |
| `cdnDomain` | ``null`` \| `string` |

#### Returns

`Promise`\<`void`\>

___

### lookup

▸ **lookup**(`widgetName`): `undefined` \| [`IWidget`](IWidget.md)

Retrieve a widget by name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `widgetName` | `string` |

#### Returns

`undefined` \| [`IWidget`](IWidget.md)

___

### saveUserPrefs

▸ **saveUserPrefs**(): `Promise`\<`any`\>

Save user preferences

#### Returns

`Promise`\<`any`\>
