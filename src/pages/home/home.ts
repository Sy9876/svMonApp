import { Component ,OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

import { JPush } from "@jiguang-ionic/jpush";
import { Device } from "@ionic-native/device";

import { MsgDetailPage } from '../../pages/msg-detail/msg-detail';
import { DaoService } from '../../app/DaoService'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public registrationId: string;

  devicePlatform: string;
  sequence: number = 0;
  msg:string;
  currentTime:Date = new Date();

  msgObj = {
    serverName: null,
    reportDate: null,
    status: null,
    msgShort: null,
    msgDetail: null
  };
  msgObjList: any[] = [];

  constructor(public navCtrl: NavController,
    public jpush: JPush,
    device: Device,
    platform: Platform,
    private cdr: ChangeDetectorRef,
    private daoService: DaoService
  ) {

    if(platform.is('android')) {
      this.devicePlatform = 'Android';
    }
    else {
      this.devicePlatform = '';
    }
    
  }
  // end of constructor


  // ngAfterViewInit() {
  //   this.cdr.detectChanges();
  // }

  ngOnInit(){

    // update currentTime
    setInterval(()=>{
      this.currentTime = new Date();
    }, 1000);

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

        var notiObj = this.addNotification(content);
        this.daoService.insertMsg(notiObj, rs => {
          console.log('HomePage. insertMsg done');

        });

        this.msg = "Receive notification: \n" + notiObj.msgDetail;
        
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

        // var content;
        // if (this.devicePlatform == "Android") {
        //   content = event.alert;
        // } else {
        //   // iOS
        //   if (event.aps == undefined) {
        //     // 本地通知
        //     content = event.content;
        //   } else {
        //     // APNS
        //     content = event.aps.alert;
        //   }
        // }

        // var notiObj = this.addNotification(content);

        // // alert("open notification: " + JSON.stringify(event));
        // this.msg = "open notification: \n" + notiObj.msgDetail;
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
        
        var notiObj = this.addNotification(content);
        
        // alert("receive local notification: " + JSON.stringify(event));
        this.msg = "receive local notification: " + JSON.stringify(event);
      },
      false
    );


    document.addEventListener('jpush.receiveRegistrationId', (event: any) => {
      console.log(event.registrationId)
    }, false)

    // add test data
    /*
    let d = new Date();
    this.addNotificationObj({
      serverName: "testSv1",
      reportDate: d,
      status: "OK",
      msgShort: "Short",
      msgDetail: "msgDetail"
    });
    this.addNotificationObj({
      serverName: "testSv2",
      reportDate: d,
      status: "NG",
      msgShort: "Short",
      msgDetail: "msgDetail"
    });
    this.addNotificationObj({
      serverName: "testSv1",
      reportDate: d,
      status: "OK",
      msgShort: "Short",
      msgDetail: "msgDetail"
    });
    */


  }
  // end of ngOnInit


  ionViewDidLoad() {
    console.log('home. ionViewDidLoad. selectMsg.');
    this.daoService.selectMsg(rs=>{
      console.log('daoService.selectMsg done.');
    });
  }




  addNotification(content: string) : any {
    // serverName: 
    // reportDate: 
    // status: 
    // msgShort: 
    // msgDetail: 

    var notiObj = JSON.parse(content);

    this.addNotificationObj(notiObj);

    return notiObj;
}

addNotificationObj(notiObj: any) : any {
  // 只保存100条
  if(this.msgObjList.length>100) {
    this.msgObjList.pop();
  }

  // 插入列表头部
  // this.msgObjList.push(notiObj);

  // setTimeout(() => {
    // console.log('setTimeout');
    this.msgObjList.splice(0, 0, notiObj);
    // this.cdr.markForCheck();

    // 需要使用这个来刷新页面，否则angular检测不到数组变化。
    this.cdr.detectChanges();
  // }, 200)
  

  this.msgObj.serverName = notiObj.serverName;
  this.msgObj.reportDate = notiObj.reportDate;
  this.msgObj.status = notiObj.status;
  this.msgObj.msgShort = notiObj.msgShort;
  this.msgObj.msgDetail = notiObj.msgDetail;

  return notiObj;
}

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



msgDetail(msgObj):void {
  console.log('msgDetail. msgObj=' + msgObj);

  // jump to msg-detail
  this.navCtrl.push(MsgDetailPage, {
    "parm1": msgObj
  });
}


saveMsg(msgObj): void {
  console.log('saveMsg. msgObj=' + msgObj);

  let sqlStr: string = '';
  let params: any[] = [];

}

}
