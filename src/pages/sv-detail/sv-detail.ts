import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SvDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sv-detail',
  templateUrl: 'sv-detail.html',
})
export class SvDetailPage {

  svObj: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.svObj = navParams.get('parm1');
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SvDetailPage');
  }

}
