# stan-js Angular adapter

This library provides an Angular adapter for [stan-js](https://github.com/codemask-labs/stan-js), enabling integration with Angular applications.

## Features
Adapter allows to use of all features from [stan-js Features](https://github.com/codemask-labs/stan-js?tab=readme-ov-file#features)

## Installation

Install package using preferred package manager:

```bash
npm install stan-js
# or
yarn add stan-js
# or
bun add stan-js
```

## Getting Started

Create a store with initial state:

You can think of a store as your app state. You can define multiple keys/values, each key will be available to use as [signal](https://angular.dev/guide/signals). By adding a getter to the state object, you can have a computed state that manipulates values from the state. Remember to import `createStore` function from `'stan-js/vanilla'`

```typescript
import { createStore } from 'stan-js/vanilla'

export const store = createStore({
	counter: 0,
	textField: 'Hello World!',
	currentTime: new Date(),
	get upperCaseTextField() {
		return this.textField.toUpperCase()
	},
})
```

To use store in your component use `injectStore` function from `'@ceski23/stan-js-angular'`. 

```typescript
state = injectStore(store)
```

To read state value simply call each signal: 

```typescript
state.counter()
```

To update state field value use signal method's like `set()` or `update()`: 

```typescript
state.counter.update(counter => counter + 1)
state.counter.set(0)
```
You can also reset state field to initial value by calling `reset()` function on `store` object providing state field name as argument:

```typescript
store.reset('counter')
```
You can find full usage examle in [this section](#example).

## Example

[![Open in repo](https://img.shields.io/badge/github-pages?style=for-the-badge&logo=github&logoColor=white&color=black
)](https://github.com/ceski23/stan-js-angular/tree/master/examples/simple-angular)
[![Open in StackBlitz](https://img.shields.io/badge/Stackblitz-fff?style=for-the-badge&logo=stackblitz&logoColor=white&labelColor=%231374EF&color=%231374EF
)](https://stackblitz.com/github/ceski23/stan-js-angular/tree/master/examples/simple-angular?preset=node)
