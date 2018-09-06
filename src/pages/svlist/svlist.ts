import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

import { SvDetailPage } from '../sv-detail/sv-detail';

@Component({
  selector: 'page-svlist',
  templateUrl: 'svlist.html'
})
export class SvListPage {

  constructor(public navCtrl: NavController, public http: HttpClient) {

  }
  msg:string;
  svObjList: any[] =  [{
    "serverName": "sv1",
    "serverDesc": "tst",
    "serverStatus": "OK"
  },
  {
    "serverName": "sv2",
    "serverDesc": "dev",
    "serverStatus": "OK"
  },
  {
    "serverName": "sv3",
    "serverDesc": "product",
    "serverStatus": "OK"
  }];

  svStatus(svObj):void {
    console.log('svStatus. svObj=' + svObj);

    this.msg='request';

    // jump to sv-detail
    this.navCtrl.push(SvDetailPage, {
      "parm1": svObj
    });

    // this.http.get('/api/v1/svList/1')
    // .subscribe((res: Response) => {
    //   console.log('res: ', res);
    //   // console.log(res);
    //   this.msg=res.status.toString();
    // },
    // (err: any) => {
    //   console.log('error: ', err);
    //   this.msg=err.status;
    // });

  }
}
