import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { JPush } from '@jiguang-ionic/jpush';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar,
     splashScreen: SplashScreen, jpush: JPush,
     private sqlite: SQLite) {

    platform.ready().then(() => {
      console.log('MyApp  start');
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      console.log('MyApp  jpush.init');
      jpush.init();
      console.log('MyApp  jpush.setDebugMode');
      jpush.setDebugMode(true);
      console.log('MyApp  done');

    });
  }

}
