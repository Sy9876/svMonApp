import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController   } from 'ionic-angular';

import { JPush } from "@jiguang-ionic/jpush";
import { Device } from "@ionic-native/device";
import { DaoService } from '../../app/DaoService'

@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {

  public registrationId: string;
  totalMsgCount: number;
  alias: string;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public jpush: JPush,
    device: Device,
    private daoService: DaoService
  ) {

  }


  
  ionViewDidEnter() {
    console.log('config. ionViewDidEnter. ');
    this.showIsEnabled();
  }



  getRegistrationID() {
    this.jpush.getRegistrationID().then(rId => {
      console.log('getRegistrationID: ' + rId);
    
      this.registrationId = rId;
    });
  }

  showRegId() {
    this.getRegistrationID();
  }

  showGroup() {
    // const toast = this.toastCtrl.create({
    //   message: '未实现',
    //   duration: 1000,
    //   position: 'middle'
    // });
    // toast.present();

    let loader = this.presentLoading();
    window['JPush'].getAlias({ sequence: 1 },
      (result) => {
        // var sequence = result.sequence
        var alias = result.alias
        console.log('ConfigPage showGroup. alias=' + alias);
        this.alias = alias;
        this.dismissLoading(loader);
      }, (error) => {
        // var sequence = error.sequence
        var errorCode = error.code
        console.log('ConfigPage showGroup. errorCode=' + errorCode);
      });


  }

  getTotalCount() {

    this.daoService.countMsg(rs=>{
      console.log('ConfigPage getTotalCount. countMsg done. rs=' + rs);
      this.totalMsgCount = rs;
    });

  }


  clearDb() {
    console.log('ConfigPage clearDb.');
    this.showConfirm(answer=>{
      if(answer) {
        this.daoService.clearDb(()=>{
          console.log('ConfigPage clearDb done.');
        });
      }
      
    })

  }


  showConfirm(cb) {
    const confirm = this.alertCtrl.create({
      title: '删除数据库记录',
      message: '确定要删除sqlite数据库记录？',
      buttons: [
        {
          text: '否',
          handler: () => {
            console.log('Disagree clicked');
            cb(false);
          }
        },
        {
          text: '是',
          handler: () => {
            console.log('Agree clicked');
            cb(true);
          }
        }
      ]
    });
    confirm.present();
  }

  showIsEnabled() {
    window['JPush'].getUserNotificationSettings(function(result) {
      if(result == 0) {
        // 系统设置中已关闭应用推送。

        const alertWin = this.alertCtrl.create({
          title: '警告',
          message: '系统设置中已关闭应用推送',
          buttons: [
            {
              text: '确定',
            }
          ]
        });
        alertWin.present();

      } else if(result > 0) {
        // 系统设置中打开了应用推送。
      }
    });
  }


  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Loading...",
      duration: 3000
    });
    loader.present();
    return loader;
    
  }

  dismissLoading(loader) {
    loader.dismiss();
  }
}
