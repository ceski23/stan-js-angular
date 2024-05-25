import {
	assertInInjectionContext,
	DestroyRef,
	effect,
	inject,
	Injector,
	runInInjectionContext,
	Signal,
	signal,
	untracked,
	WritableSignal,
} from '@angular/core'
import { createStore } from 'stan-js/vanilla'
import { GetReadonlyKeys } from './types'

/**
 * Creates a proxy object that wraps the provided store and generates signals for each property in the state.
 * The generated signals are used to read and update the state in a reactive manner.
 *
 * @param store - The store object created using the `createStore` function from the 'stan-js/vanilla' library.
 * @returns A proxy object that provides signals for each property in the state.
 * The signals can be used to read and update the state in a reactive manner.
 */
export const injectStore = <TState extends object>(
	store: ReturnType<typeof createStore<TState>>,
) => {
	assertInInjectionContext(injectStore)
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
