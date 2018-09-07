import { Component } from '@angular/core';
import { NavController, AlertController, ToastController   } from 'ionic-angular';

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


  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public jpush: JPush,
    device: Device,
    private daoService: DaoService
  ) {

  }


  getRegistrationID() {
    this.jpush.getRegistrationID().then(rId => {
      this.registrationId = rId;
    });
  }

  showRegId() {
    this.getRegistrationID();
  }

  showGroup() {
    const toast = this.toastCtrl.create({
      message: '未实现',
      duration: 1000,
      position: 'middle'
    });
    toast.present();
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


}
