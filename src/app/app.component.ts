import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from "@ionic-native/device";

import { TabsPage } from '../pages/tabs/tabs';

import { JPush } from '@jiguang-ionic/jpush';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar,
     device: Device,
     splashScreen: SplashScreen, jpush: JPush,
     ) {

    platform.ready().then(() => {
      console.log('MyApp  start');
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      if(platform.is('android') || platform.is('ios')) {
        console.log('MyApp  jpush.init');
        jpush.init();
        console.log('MyApp  jpush.setDebugMode');
        jpush.setDebugMode(true);
        console.log('MyApp  done');
      }

    });
  }

  // 声明成async也不能阻止子组件home的加载
  // async ngOnInit() {
  //   console.log('app ngOnInit setTimeout 3000 start.');
  //   await setTimeout(() => {
  //     console.log('setTimeout 3000 done.');
  //   }, 3000);
  // }

}
