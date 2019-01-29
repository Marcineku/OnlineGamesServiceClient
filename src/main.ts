import {enableProdMode, TRANSLATIONS, TRANSLATIONS_FORMAT} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import 'hammerjs';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {LOCALE_KEY} from './app/services/session-storage.service';

if (environment.production) {
  enableProdMode();
}

// use the require method provided by webpack
declare const require;
// we use the webpack raw-loader to return the content as a string
const translations = require(`raw-loader!./locale/messages.${getLocale()}.xlf`);

platformBrowserDynamic().bootstrapModule(AppModule, {
  providers: [
    {provide: TRANSLATIONS, useValue: translations},
    {provide: TRANSLATIONS_FORMAT, useValue: 'xlf'}
  ]
})
  .catch(err => console.error(err));

function getLocale() {
  const locale = window.sessionStorage.getItem(LOCALE_KEY);
  if (locale) {
    return locale;
  } else {
    return 'en';
  }
}
