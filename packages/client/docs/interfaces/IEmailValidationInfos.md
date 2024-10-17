[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IEmailValidationInfos

# Interface: IEmailValidationInfos

## Table of contents

### Properties

- [email](IEmailValidationInfos.md#email)
- [emailState](IEmailValidationInfos.md#emailstate)
- [waitInSeconds](IEmailValidationInfos.md#waitinseconds)

## Properties

### email

• **email**: `string`

The current email address of the user (maybe not verified)

___

### emailState

• **emailState**: ``null`` \| [`IEmailValidationState`](IEmailValidationState.md)

State of the current email address.

___

### waitInSeconds

• **waitInSeconds**: `number`

Suggested time to wait for the validation mail to be sent (platform configuration)
