import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DaoService } from '../../app/DaoService'

/**
 * Generated class for the MsgDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-msg-detail',
  templateUrl: 'msg-detail.html',
})
export class MsgDetailPage {

  msgObj: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController,
    private daoService: DaoService
  ) {
    this.msgObj = navParams.get('parm1');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MsgDetailPage');
  }


  deleteMsg(msgObj) {
    console.log('msgDetail deleteMsg.');
    if(msgObj==null || msgObj['id']==undefined) {
      console.log('msgDetail deleteMsg. id is null');
      return;
    }
    this.showConfirm(answer=>{
      if(answer) {
        this.daoService.deleteMsg(msgObj, ()=>{
          console.log('msgDetail deleteMsg done.');
          // 弹出页面栈
          this.navCtrl.pop();
        });
      }
      
    })

  }

  showConfirm(cb) {
    const confirm = this.alertCtrl.create({
      title: '删除记录',
      message: '确定要删除此消息？',
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
