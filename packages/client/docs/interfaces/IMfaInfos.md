[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IMfaInfos

# Interface: IMfaInfos

## Table of contents

### Properties

- [state](IMfaInfos.md#state)
- [type](IMfaInfos.md#type)
- [waitInSeconds](IMfaInfos.md#waitinseconds)

## Properties

### state

• **state**: ``null`` \| [`IMfaCodeState`](IMfaCodeState.md)

State of the generated MFA code.

___

### type

• **type**: ``"email"`` \| ``"sms"``

The type of MFA used.

___

### waitInSeconds

• **waitInSeconds**: `number`

Suggested time to wait for the MFA code to be sent (platform configuration)
