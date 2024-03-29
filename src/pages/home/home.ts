import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public http: HttpClient ) {

  }

  msg:string;

  myClick():void {
    console.log('haha');

    this.msg='request';
    this.http.get('/api/v1/auth/menus1.json')
    .subscribe((res: Response) => {
      console.log('res: ', res);
      // console.log(res);
      this.msg=res.status.toString();
    },
    (err: any) => {
      console.log('error: ', err);
      this.msg=err.status;
    });

  }
}
