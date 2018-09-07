import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ConfigPage } from '../pages/config/config';
import { SvListPage } from '../pages/svlist/svlist';
import { SvDetailPage } from '../pages/sv-detail/sv-detail';
import { HomePage } from '../pages/home/home';
import { MsgDetailPage } from '../pages/msg-detail/msg-detail';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {DaoService} from "./DaoService";

import { JPush } from '@jiguang-ionic/jpush';
import { Device } from '@ionic-native/device';
import { SQLite } from '@ionic-native/sqlite';

@NgModule({
  declarations: [
    MyApp,
    ConfigPage,
    SvListPage,
    SvDetailPage,
    HomePage,
    MsgDetailPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ConfigPage,
    SvListPage,
    SvDetailPage,
    HomePage,
    MsgDetailPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Device,
    JPush,
    SQLite,
    DaoService
  ]
})
export class AppModule {}
