[@edifice.io/ts-client](../README.md) / [Exports](../modules.md) / IAction

# Interface: IAction

Model of actions the user can -or cannot- accomplish.

## Table of contents

### Properties

- [available](IAction.md#available)
- [id](IAction.md#id)
- [right](IAction.md#right)
- [target](IAction.md#target)
- [workflow](IAction.md#workflow)

## Properties

### available

• `Optional` **available**: `boolean`

Thruthy if the user owns the corresponding right.

___

### id

• **id**: [`ActionType`](../modules.md#actiontype)

___

### right

• `Optional` **right**: [`RightRole`](../modules.md#rightrole)

___

### target

• `Optional` **target**: ``"actionbar"`` \| ``"tree"``

___

### workflow

• **workflow**: `string`

Needed workflow right to accomplish this action.
