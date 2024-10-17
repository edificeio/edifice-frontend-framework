[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / ITrackingParams

# Interface: ITrackingParams

## Hierarchy

- **`ITrackingParams`**

  ↳ [`IMatomoTrackingParams`](IMatomoTrackingParams.md)

## Table of contents

### Properties

- [detailApps](ITrackingParams.md#detailapps)
- [doNotTrack](ITrackingParams.md#donottrack)
- [trackOnly](ITrackingParams.md#trackonly)

## Properties

### detailApps

• **detailApps**: `boolean`

Set to true if state changes of the Single Page App need to be tracked.

___

### doNotTrack

• **doNotTrack**: `string`[]

Blacklist of events not to track, in the form "app" or "app.eventName" or "*.eventName".

___

### trackOnly

• **trackOnly**: `string`[]

Whitelist of events to track, in the form "app" or "app.eventName" or "*.eventName".
