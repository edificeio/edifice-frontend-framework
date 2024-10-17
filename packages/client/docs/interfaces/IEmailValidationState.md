[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IEmailValidationState

# Interface: IEmailValidationState

## Table of contents

### Properties

- [pending](IEmailValidationState.md#pending)
- [state](IEmailValidationState.md#state)
- [tries](IEmailValidationState.md#tries)
- [ttl](IEmailValidationState.md#ttl)
- [valid](IEmailValidationState.md#valid)

## Properties

### pending

• `Optional` **pending**: `string`

(optional) Current pending (or outdated) email address being checked.

___

### state

• **state**: ``"pending"`` \| ``"unchecked"`` \| ``"outdated"`` \| ``"valid"``

Validation state

___

### tries

• `Optional` **tries**: `number`

(optional) Remaining number of times a validation code can be typed in.

___

### ttl

• `Optional` **ttl**: `number`

(optional) Seconds remaining for the user to type in the correct validation code.

___

### valid

• **valid**: `string`

Last known valid email address, or empty string.
