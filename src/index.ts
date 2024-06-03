import {
	assertInInjectionContext,
	DestroyRef,
	effect,
	inject,
	InjectionToken,
	Injector,
	Provider,
	runInInjectionContext,
	Signal,
	signal,
	untracked,
	WritableSignal,
} from '@angular/core'
import { createStore as createStoreVanilla } from 'stan-js/vanilla'
import { GetReadonlyKeys, Store } from './types'

/**
 * Creates a proxy object that wraps the provided store and generates signals for each property in the state.
 * The generated signals are used to read and update the state in a reactive manner.
 *
 * @param store - The store object created using the `createStore` function from the 'stan-js/vanilla' library.
 * @returns A proxy object that provides signals for each property in the state.
 * The signals can be used to read and update the state in a reactive manner.
 */
export const injectState = <TState extends object>(store: Store<TState>) => {
	assertInInjectionContext(injectState)
	const injector = inject(Injector)

	return runInInjectionContext(injector, () => {
		const destroyRef = inject(DestroyRef)
		// Create a proxy object to generate signals for each store key
		const generatedSignals = {} as { [K in keyof TState]: WritableSignal<TState[K]> }

		return new Proxy(generatedSignals, {
			get(target, prop) {
				const key = prop as keyof typeof target
				// @ts-expect-error
				const action = store.actions[`set${key[0].toUpperCase()}${key.slice(1)}`]

				if (!(key in target)) {
					// Create a signal for the store key
					target[key] = signal(store.getState()[key])

					// Track signal changes and update the store
					untracked(() =>
						effect(() => action?.(target[key]()), {
							injector,
							allowSignalWrites: true,
						})
					)

					// Subscribe to store changes and update the signal
					const unsubscribe = store.subscribe([key])(() => {
						target[key].set(store.getState()[key])
					})

					// Unsubscribe from store changes when the signal is destroyed
					destroyRef.onDestroy(unsubscribe)
				}

				// Return a readonly signal for readonly keys
				return action === undefined ? target[key].asReadonly() : target[key]
			},
		}) as {
			[K in keyof TState]: K extends GetReadonlyKeys<TState> ? Signal<TState[K]> : WritableSignal<TState[K]>
		}
	})
}

const mergeState = <TState extends object>(state: TState, partialState: Partial<Omit<TState, GetReadonlyKeys<TState>>>) => {
	const newState = Object.assign({}, state)

	Object.defineProperties(newState, Object.getOwnPropertyDescriptors(state))
	Object.keys(partialState ?? {}).forEach(key => {
		const stateKey = key as keyof TState

		if (Object.getOwnPropertyDescriptor(newState, stateKey)?.get === undefined) {
			newState[stateKey] = partialState?.[key as keyof typeof partialState] ?? state[stateKey]
		}
	})

	return newState
}

export const createStore = <TState extends object>(initialState: TState) => {
	const STORE_INJECTION_TOKEN = new InjectionToken<Store<TState>>('stan-js-angular')

	// The provideStore function is a factory function that provides a store instance to the Angular DI system.
	const provideStore = (overridedState?: Partial<Omit<TState, GetReadonlyKeys<TState>>>): Provider => ({
		provide: STORE_INJECTION_TOKEN,
		// Create a new state object by merging the initial state with the overrided state
		useFactory: () => createStoreVanilla<TState>(mergeState(initialState, overridedState ?? {})),
	})
	const injectStore = (): Store<TState> => inject(STORE_INJECTION_TOKEN)
	const injectStoreState = () => injectState(injectStore())

	return {
		/**
		 * Provides a store instance to the Angular DI system.
		 */
		provideStore,
		/**
		 * Injects the store instance from the Angular DI system.
		 */
		injectStore,
		/**
		 * Injects a proxy object that wraps the provided store and generates signals for each property in the state.
		 * The generated signals are used to read and update the state in a reactive manner.
		 *
		 * @returns A proxy object that provides signals for each property in the state.
		 * The signals can be used to read and update the state in a reactive manner.
		 */
		injectStoreState,
	}
}
