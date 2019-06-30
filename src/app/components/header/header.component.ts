import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Events } from '@ionic/angular';
import { Subscription, Observable } from 'rxjs';

import { AppState } from 'src/app/State';
import { ClockedHour } from 'src/app/state/clockedHours/clockedHours.model';

import { Tutorial, TutorialStage } from 'src/app/state/tutorial/tutorial.model';
import { ClockerService } from 'src/app/services/clocker/clocker.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
	private subs: Subscription[];
	private clockedHours$: Observable<ClockedHour>;
	private tutObs$: Observable<Tutorial>;

	private isActiveClock: boolean;

	isTutVisible: boolean;
	tutStage: TutorialStage;

	constructor(
		store: Store<AppState>,
		private events: Events,
		private clocker: ClockerService
	) {
		this.clockedHours$ = store.select("clockedHours");
		this.tutObs$ = store.select("tutorial");
	}

	ngOnInit() {
		this.subs.push(
			this.clockedHours$.subscribe((result: ClockedHour) => {
				this.isActiveClock = result.isActive;
			}),
			this.tutObs$.subscribe(({ isVisible, stage }: Tutorial) => {
				this.isTutVisible = isVisible;
				this.tutStage = stage;
			})
		);
	}

	ngOnDestroy(): void {
		this.subs.forEach(s => s.unsubscribe());
	}

	onBtnPress(): void {
		if (this.isActiveClock) {
			this.clockOut();
		} else {
			this.clockIn();
		}
	}

	clockIn(): void {
		this.clocker.clockIn();

		this.showToast("home.clockedIn");
	}

	clockOut(): void {
		this.clocker.clockOut();

		this.showToast("home.clockedOut");
	}

	private showToast(key: string) {
		this.events.publish("showToast", key);
	}
}
