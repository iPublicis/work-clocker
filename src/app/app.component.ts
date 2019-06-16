import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

import { StorageService } from './services/storage/storage.service';

import { Update as UpdateSettings } from "./state/settings/settings.actions";
import { AddHours as SetExtraHours } from "./state/extraHours/extraHours.actions";
import { AddHours as SetOwedHours } from "./state/owedHours/owedHours.actions";
import { SetHours as SetClockedHours } from "./state/clockedHours/clockedHours.actions";

import { AppState } from './State';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		private translate: TranslateService,
		private storage: StorageService,
		private store: Store<AppState>
	) { }

	ngOnInit() {
		this.platform.ready().then(async () => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			this.translate.setDefaultLang("en_US");

			Promise.all([
				this.storage.get("extraHours"),
				this.storage.get("owedHours"),
				this.storage.get("settings"),
				this.storage.get("clockedHours"),
				// this.storage.clear(),
			]).then(results => {
				const clockedHours = results[3];
				const extraHours = results[0];
				const owedHours = results[1];

				this.store.dispatch(new SetExtraHours(extraHours ? extraHours : 0));

				this.store.dispatch(new SetOwedHours(owedHours ? owedHours : 0));

				if (results[2]) {
					const { selectedDateFormat, selectedLanguage, selectedLunchDuration, selectedWorkDuration } = results[2];

					this.store.dispatch(new UpdateSettings({
						selectedDateFormat,
						selectedLanguage,
						selectedLunchDuration,
						selectedWorkDuration
					}));
				}

				if (clockedHours) {
					this.store.dispatch(new SetClockedHours({
						hours: clockedHours,
						isActive: clockedHours[0].isActive
					}));
				}
			});
		});
	}
}
