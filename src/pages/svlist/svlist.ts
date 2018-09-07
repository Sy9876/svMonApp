import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

import { SvDetailPage } from '../sv-detail/sv-detail';
import { DaoService } from '../../app/DaoService'

@Component({
  selector: 'page-svlist',
  templateUrl: 'svlist.html'
})
export class SvListPage {

  msg:string;
  totalMsgCount: number;
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

  constructor(public navCtrl: NavController, 
    public platform: Platform,
    public http: HttpClient, 
    private daoService: DaoService) {

  }

  ngOnInit() {
    console.log('SvListPage ngOnInit. start');

  }

  ionViewDidLoad() {
    console.log("svList. ionViewDidLoad");
  }

  ionViewDidEnter() {
    console.log("svList. ionViewDidEnter");
    this.loadSvList();
  }


  loadSvList(): void {
    this.platform.ready().then(() => {
        this.daoService.countMsg((rs) => {
          console.log('SvListPage loadSvList. countMsg done. rs=' + rs);
          this.totalMsgCount = rs;
        });
    });

  }

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
