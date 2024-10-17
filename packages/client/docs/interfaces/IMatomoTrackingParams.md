[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IMatomoTrackingParams

# Interface: IMatomoTrackingParams

## Hierarchy

- [`ITrackingParams`](ITrackingParams.md)

  ↳ **`IMatomoTrackingParams`**

## Table of contents

### Properties

- [Profile](IMatomoTrackingParams.md#profile)
- [Project](IMatomoTrackingParams.md#project)
- [School](IMatomoTrackingParams.md#school)
- [UserId](IMatomoTrackingParams.md#userid)
- [detailApps](IMatomoTrackingParams.md#detailapps)
- [doNotTrack](IMatomoTrackingParams.md#donottrack)
- [siteId](IMatomoTrackingParams.md#siteid)
- [trackOnly](IMatomoTrackingParams.md#trackonly)
- [url](IMatomoTrackingParams.md#url)

## Properties

### Profile

• **Profile**: `string`

___

### Project

• **Project**: `string`

___

### School

• **School**: `string`

___

### UserId

• **UserId**: `string`

___

### detailApps

• **detailApps**: `boolean`

Set to true if state changes of the Single Page App need to be tracked.

#### Inherited from

[ITrackingParams](ITrackingParams.md).[detailApps](ITrackingParams.md#detailapps)

___

### doNotTrack

• **doNotTrack**: `string`[]

Blacklist of events not to track, in the form "app" or "app.eventName" or "*.eventName".

#### Inherited from

[ITrackingParams](ITrackingParams.md).[doNotTrack](ITrackingParams.md#donottrack)

___

### siteId

• **siteId**: `number`

___

### trackOnly

• **trackOnly**: `string`[]

Whitelist of events to track, in the form "app" or "app.eventName" or "*.eventName".

#### Inherited from

[ITrackingParams](ITrackingParams.md).[trackOnly](ITrackingParams.md#trackonly)

___

### url

• **url**: `string`
