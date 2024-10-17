[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / ITimelineApp

# Interface: ITimelineApp

## Table of contents

### Properties

- [flashMessages](ITimelineApp.md#flashmessages)
- [hasMorePage](ITimelineApp.md#hasmorepage)
- [isLoading](ITimelineApp.md#isloading)
- [notificationTypes](ITimelineApp.md#notificationtypes)
- [notifications](ITimelineApp.md#notifications)
- [page](ITimelineApp.md#page)
- [preferences](ITimelineApp.md#preferences)
- [selectedNotificationTypes](ITimelineApp.md#selectednotificationtypes)
- [showMine](ITimelineApp.md#showmine)

### Methods

- [initialize](ITimelineApp.md#initialize)
- [loadFlashMessages](ITimelineApp.md#loadflashmessages)
- [loadNotifications](ITimelineApp.md#loadnotifications)
- [markAsRead](ITimelineApp.md#markasread)
- [resetPagination](ITimelineApp.md#resetpagination)
- [savePreferences](ITimelineApp.md#savepreferences)

## Properties

### flashMessages

• `Readonly` **flashMessages**: [`IFlashMessageModel`](IFlashMessageModel.md)[]

___

### hasMorePage

• `Readonly` **hasMorePage**: `boolean`

___

### isLoading

• `Readonly` **isLoading**: `boolean`

___

### notificationTypes

• `Readonly` **notificationTypes**: `string`[]

___

### notifications

• `Readonly` **notifications**: [`ITimelineNotification`](ITimelineNotification.md)[]

___

### page

• `Readonly` **page**: `number`

___

### preferences

• `Readonly` **preferences**: `any`

___

### selectedNotificationTypes

• `Readonly` **selectedNotificationTypes**: `string`[]

___

### showMine

• **showMine**: `boolean`

## Methods

### initialize

▸ **initialize**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

___

### loadFlashMessages

▸ **loadFlashMessages**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

___

### loadNotifications

▸ **loadNotifications**(`force?`): `Promise`\<`void`\>

Load more notifications, or force loading more by virtually incrementing the page.

#### Parameters

| Name | Type |
| :------ | :------ |
| `force?` | `boolean` |

#### Returns

`Promise`\<`void`\>

___

### markAsRead

▸ **markAsRead**(`msg`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | [`IFlashMessageModel`](IFlashMessageModel.md) |

#### Returns

`Promise`\<`void`\>

___

### resetPagination

▸ **resetPagination**(): `void`

#### Returns

`void`

___

### savePreferences

▸ **savePreferences**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>
