[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IMobileValidationState

# Interface: IMobileValidationState

## Table of contents

### Properties

- [pending](IMobileValidationState.md#pending)
- [state](IMobileValidationState.md#state)
- [tries](IMobileValidationState.md#tries)
- [ttl](IMobileValidationState.md#ttl)
- [valid](IMobileValidationState.md#valid)

## Properties

### pending

• `Optional` **pending**: `string`

(optional) Current pending (or outdated) phone number being checked.

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

Last known valid phone number, or empty string.
