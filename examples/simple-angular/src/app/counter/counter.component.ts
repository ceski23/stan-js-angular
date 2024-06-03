import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, effect, ElementRef, inject } from '@angular/core'
import { animateChange } from '../../utils/animateStateChanged'
import { injectStore, injectStoreState } from '../store'

@Component({
	selector: 'app-counter',
	standalone: true,
	imports: [CommonModule],
	template: `<h1>Counter</h1>
    <div class="content">
      <div class="pill-group">
        <button class="pill" (click)="increment()">increment</button>
        <button class="pill" (click)="decrement()">decrement</button>
        <button class="pill" (click)="reset()">reset</button>
      </div>
      <div class="counter-state">
        <h2 class="text-color">counter:</h2>
        <h2>{{ state.counter() }}</h2>
      </div>
    </div>`,
	styleUrl: './counter.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
	elementRef = inject(ElementRef)
	store = injectStore()
	state = injectStoreState()

	increment() {
		this.state.counter.update(counter => counter + 1)
	}
	decrement() {
		this.state.counter.update(counter => counter - 1)
	}

	reset() {
		this.store.reset('counter')
	}

	constructor() {
		effect(() => {
			this.state.counter()
			animateChange(this.elementRef)
		})
	}
}
