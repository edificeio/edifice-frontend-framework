[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / ITheme

# Interface: ITheme

## Table of contents

### Properties

- [basePath](ITheme.md#basepath)
- [is1D](ITheme.md#is1d)
- [is2D](ITheme.md#is2d)
- [logoutCallback](ITheme.md#logoutcallback)
- [portalTemplate](ITheme.md#portaltemplate)
- [skin](ITheme.md#skin)
- [skinName](ITheme.md#skinname)
- [skins](ITheme.md#skins)
- [themeName](ITheme.md#themename)
- [themeUrl](ITheme.md#themeurl)

### Methods

- [getConf](ITheme.md#getconf)
- [getHelpPath](ITheme.md#gethelppath)
- [listSkins](ITheme.md#listskins)
- [listThemes](ITheme.md#listthemes)
- [onFullyReady](ITheme.md#onfullyready)
- [onOverrideReady](ITheme.md#onoverrideready)
- [onSkinReady](ITheme.md#onskinready)
- [setDefaultTheme](ITheme.md#setdefaulttheme)

## Properties

### basePath

• `Readonly` **basePath**: `string`

(legacy) URL to the folder containing assets.

___

### is1D

• `Readonly` **is1D**: `boolean`

Check if the "school degree" of the current theme is 1D ("panda", or an override of it).

___

### is2D

• `Readonly` **is2D**: `boolean`

Check if the "school degree" of the current theme is 2D ("theme-open-ent" or an override of it).

___

### logoutCallback

• `Readonly` **logoutCallback**: `string`

(legacy) URL where the user is redirected after logout.

___

### portalTemplate

• `Readonly` **portalTemplate**: `string`

(legacy) URL to the currently active portal.html template. Used in infra-front.

___

### skin

• `Readonly` **skin**: `string`

(legacy) FIXME Seems to be equal to themeName.

___

### skinName

• `Readonly` **skinName**: `string`

(legacy) Name of the currently active skin (user's choice in /timeline) : "default" by default, or another available name.

___

### skins

• `Readonly` **skins**: [`IThemeConfOverriding`](IThemeConfOverriding.md)[]

Available skins configuration (also called "overrides").

___

### themeName

• `Readonly` **themeName**: `string`

(legacy) Name of the currently active theme, derived from a parent which is classified as 1D (panda) or 2D(theme-open-ent). This is a domain-level configurated value.

___

### themeUrl

• `Readonly` **themeUrl**: `string`

(legacy) URL to the currently active theme/skin folder.

## Methods

### getConf

▸ **getConf**(`version?`): `Promise`\<[`IThemeConf`](IThemeConf.md)\>

Get the theme/skin configuration.

#### Parameters

| Name | Type |
| :------ | :------ |
| `version?` | `string` |

#### Returns

`Promise`\<[`IThemeConf`](IThemeConf.md)\>

___

### getHelpPath

▸ **getHelpPath**(): `Promise`\<`String`\>

Get the help path, which can be dedicated to 1D or 2D.

#### Returns

`Promise`\<`String`\>

___

### listSkins

▸ **listSkins**(): `Promise`\<[`IThemeConfOverriding`](IThemeConfOverriding.md)[]\>

List available skins.

#### Returns

`Promise`\<[`IThemeConfOverriding`](IThemeConfOverriding.md)[]\>

___

### listThemes

▸ **listThemes**(): `Promise`\<[`IThemeDesc`](IThemeDesc.md)[]\>

List available themes.

#### Returns

`Promise`\<[`IThemeDesc`](IThemeDesc.md)[]\>

___

### onFullyReady

▸ **onFullyReady**(): `Promise`\<[`ITheme`](ITheme.md)\>

Await for theme to be fully loaded (skin, overrides, degrees...).

#### Returns

`Promise`\<[`ITheme`](ITheme.md)\>

___

### onOverrideReady

▸ **onOverrideReady**(): `Promise`\<[`IThemeOverrides`](../modules.md#ithemeoverrides)\>

Await for overrides conf to be loaded.

#### Returns

`Promise`\<[`IThemeOverrides`](../modules.md#ithemeoverrides)\>

___

### onSkinReady

▸ **onSkinReady**(): `Promise`\<[`ITheme`](ITheme.md)\>

Await for skin conf to be loaded.

#### Returns

`Promise`\<[`ITheme`](ITheme.md)\>

___

### setDefaultTheme

▸ **setDefaultTheme**(`theme`): `void`

Configure UI with this theme by default.

#### Parameters

| Name | Type |
| :------ | :------ |
| `theme` | [`IThemeDesc`](IThemeDesc.md) |

#### Returns

`void`
