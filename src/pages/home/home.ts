import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

import { JPush } from "@jiguang-ionic/jpush";
import { Device } from "@ionic-native/device";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public registrationId: string;

  devicePlatform: string;
  sequence: number = 0;
  msg:string;

  getRegistrationID() {
    this.jpush.getRegistrationID().then(rId => {
      this.registrationId = rId;
    });
  }

  addLocalNotification() {
    if (this.devicePlatform == "Android") {
      this.jpush.addLocalNotification(0, "Hello JPush", "JPush", 1, 5000);
    } else {
      this.jpush.addLocalNotificationForIOS(5, "Hello JPush", 1, "localNoti1");
    }
  }

  constructor(public navCtrl: NavController,
    public jpush: JPush,
    device: Device
  ) {

    this.devicePlatform = device.platform;

    /**
     * 收到平台推送
     */
    document.addEventListener(
      "jpush.receiveNotification",
      (event: any) => {

        console.log('HomePage. on jpush.receiveNotification');

        var content;
        if (this.devicePlatform == "Android") {
          content = event.alert;
        } else {
          content = event.aps.alert;
        }
        console.log('HomePage. on jpush.receiveNotification devicePlatform=' + this.devicePlatform);
        // alert("Receive notification: " + JSON.stringify(event));
        this.msg = "Receive notification: " + JSON.stringify(event);
        console.log('HomePage. on jpush.receiveNotification event=' + this.msg);
        
      },
      false
    );

    /**
     * 点击通知栏消息后触发
     */
    document.addEventListener(
      "jpush.openNotification",
      (event: any) => {

        console.log('HomePage. on jpush.openNotification');

        var content;
        if (this.devicePlatform == "Android") {
          content = event.alert;
        } else {
          // iOS
          if (event.aps == undefined) {
            // 本地通知
            content = event.content;
          } else {
            // APNS
            content = event.aps.alert;
          }
        }
        // alert("open notification: " + JSON.stringify(event));
        this.msg = "open notification: " + JSON.stringify(event);
      },
      false
    );

    document.addEventListener(
      "jpush.receiveLocalNotification",
      (event: any) => {

        console.log('HomePage. on jpush.receiveLocalNotification');

        // iOS(*,9) Only , iOS(10,*) 将在 jpush.openNotification 和 jpush.receiveNotification 中触发。
        var content;
        if (this.devicePlatform == "Android") {
        } else {
          content = event.content;
        }
        // alert("receive local notification: " + JSON.stringify(event));
        this.msg = "receive local notification: " + JSON.stringify(event);
      },
      false
    );


    document.addEventListener('jpush.receiveRegistrationId', (event: any) => {
      console.log(event.registrationId)
    }, false)





  }


}
