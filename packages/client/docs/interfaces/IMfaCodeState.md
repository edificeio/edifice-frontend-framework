[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IMfaCodeState

# Interface: IMfaCodeState

## Table of contents

### Properties

- [state](IMfaCodeState.md#state)
- [tries](IMfaCodeState.md#tries)
- [ttl](IMfaCodeState.md#ttl)

## Properties

### state

• **state**: ``"pending"`` \| ``"outdated"`` \| ``"valid"``

Validation state

___

### tries

• `Optional` **tries**: `number`

(optional) Remaining number of times a code can be typed in.

___

### ttl

• `Optional` **ttl**: `number`

(optional) Seconds remaining for the user to type in the correct code.
