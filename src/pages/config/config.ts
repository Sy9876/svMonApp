import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { JPush } from "@jiguang-ionic/jpush";
import { Device } from "@ionic-native/device";

@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {

  public registrationId: string;

  getRegistrationID() {
    this.jpush.getRegistrationID().then(rId => {
      this.registrationId = rId;
    });
  }

  showRegId() {
    this.getRegistrationID();
  }
  constructor(public navCtrl: NavController,
    public jpush: JPush,
    device: Device
  ) {

  }

}
