import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CounterComponent } from './counter/counter.component'
import { CurrentTimeComponent } from './current-time/current-time.component'
import { provideStore } from './store'
import { TextFieldComponent } from './text-field/text-field.component'

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [CounterComponent, TextFieldComponent, CurrentTimeComponent],
	providers: [
		provideStore(),
	],
	template: `<main class="main">
  <div class="section">
    <app-counter></app-counter>
  </div>
  <div class="divider"></div>
  <div class="section">
    <app-text-field></app-text-field>
  </div>
  <div class="divider"></div>
  <div class="section">
    <app-current-time></app-current-time>
  </div>
</main>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
