[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IConfigurationFramework

# Interface: IConfigurationFramework

## Table of contents

### Properties

- [Platform](IConfigurationFramework.md#platform)
- [School](IConfigurationFramework.md#school)
- [User](IConfigurationFramework.md#user)

### Methods

- [initialize](IConfigurationFramework.md#initialize)

## Properties

### Platform

• `Readonly` **Platform**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `analytics` | \{ `status`: [`AnalyticStatus`](../modules.md#analyticstatus) ; `parameters`: \<T\>(`type`: [`TrackingType`](../modules.md#trackingtype)) => `Promise`\<`undefined` \| `T`\> ; `xiti`: () => `Promise`\<`undefined` \| [`IXitiTrackingParams`](IXitiTrackingParams.md)\>  } | Configured tracking. |
| `analytics.status` | [`AnalyticStatus`](../modules.md#analyticstatus) | Check the status, if something goes wrong. |
| `analytics.parameters` | [object Object] | Get a tracker parameters. |
| `analytics.xiti` | [object Object] | Get the XiTi configuration. This method awaits for the session to be be fully loaded. //FIXME refactor xiti configuration |
| `apps` | \{ `getPublicConf`: (`app`: `string`) => `Promise`\<`any`\> ; `getWebAppConf`: (`app`: `string`) => `Promise`\<`undefined` \| [`IWebApp`](IWebApp.md)\> ; `initialize`: (`app`: `string`, `alternativeApp?`: `boolean`) => `Promise`\<`void`\> ; `loadI18n`: (`app`: `string`) => `Promise`\<`void`\>  } | - |
| `apps.getPublicConf` | [object Object] | Load and return the public conf of an app. |
| `apps.getWebAppConf` | [object Object] | Load and return the server conf of an app. |
| `apps.initialize` | [object Object] | Initialize an app (preload its public conf and i18n) |
| `apps.loadI18n` | [object Object] | Load the i18n of an app. |
| `cdnDomain` | `string` | - |
| `deploymentTag` | `string` | - |
| `idiom` | [`IIdiom`](IIdiom.md) | I18n (port from legacy infra-front) |
| `theme` | [`ITheme`](ITheme.md) | Configured theme. |
| `listLanguages` | () => `Promise`\<`string`[]\> | - |

___

### School

• `Readonly` **School**: `Object`

___

### User

• `Readonly` **User**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `bookmarkedApps` | [`IWebApp`](IWebApp.md)[] | User's prefered apps. |
| `keepOpenOnLogout` | `boolean` | Legacy option (//FIXME which use ?). |
| `preferences` | [`IUserPreferences`](IUserPreferences.md) | User's preferences. |
| `loadAppPrefs` | (`app`: `string`) => `Promise`\<`any`\> | Load the user's preferences for the given app. |
| `loadLanguage` | () => `Promise`\<`string`\> | - |
| `saveAppPrefs` | (`app`: `string`) => `Promise`\<`void`\> | Save the user's preferences for the given app. |
| `saveLanguage` | (`lang`: `string`) => `Promise`\<`void`\> | - |

## Methods

### initialize

▸ **initialize**(`version`, `cdnDomain`): `Promise`\<`void`\>

Framework initialization

#### Parameters

| Name | Type |
| :------ | :------ |
| `version` | ``null`` \| `string` |
| `cdnDomain` | ``null`` \| `string` |

#### Returns

`Promise`\<`void`\>
