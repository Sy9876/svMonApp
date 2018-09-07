import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
// {
//   providedIn: 'root'
// }
export class DaoService {

  DB_NAME:string = 'svmon.db';
  DB_CONFIG:any = {name: 'svmon.db', location: 'default'};

  db: SQLiteObject = null;
  dbJs: any = null;
  sqlitePlugin = window['sqlitePlugin'];
  devicePlatform: string;

  constructor(public platform: Platform,
    public sqlite: SQLite) {

    if(platform.is('android')) {
      this.devicePlatform = 'Android';

      this.openDb();

    }
    else {
      this.devicePlatform = '';
    }

    

 }

  /**
   * 打开db，保存db handler，如果需要则建表
   */
  openDb(): void {

    if (this.devicePlatform != "Android") {
      return;
    }

    this.platform.ready().then(() => {
    console.log('DaoService start. on platform.ready. open sqlite db.');
    
    //  this.createSqliteDb();
    // this.selfTest();

    if(this.dbJs!=null) {
      return;
    }

    if(this.sqlitePlugin!=null) {
      // 打开DB
      this.sqlitePlugin.openDatabase(this.DB_CONFIG, db => {
        console.log('sqlitePlugin.openDatabase  ok. db=' + db);

        let sqlStr = `SELECT COUNT(*) as cnt FROM sqlite_master WHERE type='table' and name='mon_msg'`;
        db.executeSql(sqlStr, [], rs => {
          let cnt = rs.rows.item(0).cnt;
          console.log('executeSql  SELECT COUNT(*)  success. cnt=' + cnt);
          if(cnt==0) {
            // create table
            this.createTable(db, (err, rs)=>{
              if(err==null) {
                // 保存db handler
                // console.log('save db to dbJs');
                this.dbJs = db;
              }
            });
          }
          else {
            // console.log('save db to dbJs 2');
            this.dbJs = db;
          }
        },
        err => {
          console.log('executeSql  SELECT COUNT(*)  err');
        });

      },
      err => {
        console.log('sqlitePlugin.openDatabase  err');
      });
    }

    });
  }


 /**
  * 
  */
 createTable(dbJs, cb): void {
  if (this.devicePlatform != "Android") {
    return;
  }
   let createTableSql = `
    create table if not exists mon_msg (
      id integer primary key autoincrement,
      serverName varchar(32),
      reportTimestamp integer,
      status varchar(10),
      msgShort varchar(100),
      msgDetail varchar(65535)
    );
   `;

    console.log('createSqliteDb. 210 do executeSql. ' + createTableSql);

    dbJs.executeSql(createTableSql, [], rs=>{
      console.log('300 Executed createDbSql SQL done.');
      cb();
    },
    e=>{
      console.log('400 Executed createDbSql SQL error.');
      // console.log('401 Executed createDbSql SQL error. e.rows.item(0)=' + e.rows.item(0));
      // console.log('401 Executed createDbSql SQL error. json=' + JSON.stringify(e));
      // console.log('401 Executed createDbSql SQL error. json=' + JSON.stringify(e.rows.item(0)));
      // this.showObj(e);
    });

 }

 convertToMsgObj(record) {
    // console.log('convertToMsgObj start');
    let msgObj:any = {};
    msgObj.id = record.id;
    msgObj.serverName = record.serverName;
    let reportTimestamp = record.reportTimestamp;
    msgObj.reportDate = new Date(reportTimestamp);
    // console.log('convertToMsgObj reportTimestamp=' + reportTimestamp + "  ->  " + msgObj.reportDate);
    msgObj.status = record.status;
    msgObj.msgShort = record.msgShort;
    msgObj.msgDetail = record.msgDetail;

    // console.log('convertToMsgObj end');
    return msgObj;
 }

 convertMsgObjToHostParam(msgObj) {
  let params: any = [];
  params.push(msgObj.serverName);
  if(msgObj.reportDate) {
    // 保存时间戳
    let x = typeof(msgObj.reportDate);
    // console.log('insertMsg. typeof msgObj.reportDate is :' + x);
    // console.log('insertMsg. msgObj.reportDate is :' + msgObj.reportDate);
    let ts: number = 0;
    if(x=='string') {
      let d = new Date(msgObj.reportDate);
      // console.log('insertMsg. d :' + d);
      ts = d.getTime();
    }
    else {
      ts = msgObj.reportDate.getTime();
    }
    // console.log('convertMsgObjToHostParam.  ' + msgObj.reportDate + '  ->  ' + ts);
    params.push(ts);
  }
  else {
    params.push(null);
  }
  params.push(msgObj.status);
  params.push(msgObj.msgShort);
  params.push(msgObj.msgDetail);

  return params;
 }

 /**
  * 
  * @param msgObj 
  * @param cb 
  */
 async insertMsg(msgObj:any, cb: Function): Promise<any> {
  console.log('insertMsg');

  if (this.devicePlatform != "Android") {
    return;
  }

  let sqlStr = 
    'insert into mon_msg (serverName, reportTimestamp, status, msgShort, msgDetail) '
    + ' values (?, ?, ?, ?, ?);'
    ;

  let params = this.convertMsgObjToHostParam(msgObj);

  console.log('insertMsg. waitDbPrepared');
  await this.waitDbPrepared();

  console.log('insertMsg. executeSql insert');
  this.dbJs.executeSql(sqlStr, params, rs=>{
    console.log('insertMsg. executeSql insert success');

    // // 获取自增id
    // this.getAutoIncreaseId('mon_msg', id=>{
    //   cb(id);
    // })

    cb();
    
  },
  e=>{
    console.log('insertMsg. executeSql insert err');

  });

  }


 /**
  * 获取自增id
  * @param cb 
  */
 getAutoIncreaseId(tableName:string, cb: Function): void {
  console.log('getAutoIncreaseId');

  let sqlStr = 'select last_insert_rowid() as id from from ' + tableName;

  console.log('getAutoIncreaseId. executeSql ' + sqlStr);
  this.dbJs.executeSql(sqlStr, [], rs=>{
    console.log('getAutoIncreaseId. executeSql select last_insert_rowid success');
    cb(rs.rows.item(0)['id']);
  },
  e=>{
    console.log('getAutoIncreaseId. executeSql select last_insert_rowid err');

  });

 }




 /**
  * 
  * @param cb 
  */
 async countMsg(cb: Function): Promise<any> {
  console.log('countMsg');

  if (this.devicePlatform != "Android") {
    return;
  }

  let sqlStr = 'select count(1) as cnt from mon_msg';

  console.log('countMsg. waitDbPrepared');
  if(this.dbJs==null) {
    await this.waitDbPrepared();
  }
  console.log('countMsg. executeSql select. this.dbJs=' + this.dbJs);
  this.dbJs.executeSql(sqlStr, [], rs=>{
    console.log('countMsg. executeSql select success');
    cb(rs.rows.item(0)['cnt']);
  },
  e=>{
    console.log('countMsg. executeSql select err');

  });

 }


 

 /**
  * 删除一条记录
  * @param cb 
  */
 async deleteMsg(msgObj:any, cb: Function): Promise<any> {
  console.log('deleteMsg. id=' + msgObj.id);
  if(msgObj.id==undefined) {
    return;
  }
  if (this.devicePlatform != "Android") {
    return;
  }

  let sqlStr = 'delete from mon_msg where id = ?';

  console.log('deleteMsg. waitDbPrepared');
  if(this.dbJs==null) {
    await this.waitDbPrepared();
  }
  console.log('deleteMsg. executeSql delete. this.dbJs=' + this.dbJs);
  this.dbJs.executeSql(sqlStr, [msgObj.id], rs=>{
    console.log('deleteMsg. executeSql delete success');
    cb();
  },
  e=>{
    console.log('deleteMsg. executeSql delete err');

  });

 }


 /**
  * delete mon_msg
  * @param cb 
  */
 async clearDb(cb: Function): Promise<any> {
  console.log('clearDb');

  if (this.devicePlatform != "Android") {
    return;
  }

  let sqlStr = 'delete from mon_msg';

  console.log('clearDb. waitDbPrepared');
  if(this.dbJs==null) {
    await this.waitDbPrepared();
  }
  console.log('clearDb. executeSql delete. this.dbJs=' + this.dbJs);
  this.dbJs.executeSql(sqlStr, [], rs=>{
    console.log('clearDb. executeSql delete success');
    cb();
  },
  e=>{
    console.log('countMsg. executeSql delete err');

  });

}




 /**
  * 
  * @param cb 
  */
 async selectMsg(cb: Function) {
  console.log('selectMsg');

  if (this.devicePlatform != "Android") {
    return;
  }

  let sqlStr = `select id, serverName, reportTimestamp, status, msgShort, msgDetail
    from mon_msg
    order by reportTimestamp desc
    limit 10
    `;

  console.log('selectMsg. waitDbPrepared');
  await this.waitDbPrepared();

  console.log('selectMsg. executeSql select limit 10');
  this.dbJs.executeSql(sqlStr, [], rs=>{
    console.log('selectMsg. executeSql select success');
    cb(rs);
  },
  e=>{
    console.log('selectMsg. executeSql select err');

  });

 }





 /**
  * 
  * @param cb 
  */
 async countMsgBySv(cb: Function) {
  console.log('countMsgBySv');

  if (this.devicePlatform != "Android") {
    return;
  }

  let sqlStr = `select serverName, count(1) as cnt from mon_msg group by serverName`;

  console.log('countMsgBySv. waitDbPrepared');
  await this.waitDbPrepared();

  console.log('countMsgBySv. executeSql select count group by serverName');
  this.dbJs.executeSql(sqlStr, [], rs=>{
    console.log('countMsgBySv. executeSql select count group by serverName success');
    cb(rs);
  },
  e=>{
    console.log('countMsgBySv. executeSql select count group by serverName err');

  });

 }


 
 selfTest(): void {

  if (this.devicePlatform != "Android") {
    return;
  }

  console.log('selfTest. 100 sqlite.selfTest start.');
  this.sqlite.selfTest()
   .then((db: SQLiteObject) => {

     console.log('selfTest. 200 sqlite.selfTest done.');
    //  console.log('selfTest. 220 db：' + db);


   })
   .catch(e => {
     console.log('500 selfTest. sqlite.create error.');
    //  console.log(e)
   });
}


 showObj(obj): void {
  if(Object.keys(obj).length==0) {
    return;
  }
  for(var p in obj) {
    console.log('p: ' + p + ' v: ' + obj[p]);
    this.showObj(obj[p]);
  }
 }

 async waitDbPrepared():Promise<any> {
    let timeoutMS = 0;
    if(this.dbJs==null) {
      timeoutMS=500;
    }
    let p = new Promise((resolve, reject)=>{
      setTimeout(()=>{
        console.log('waitDbPrepared resolve')
        resolve();
      },timeoutMS);
    });
    return p;

 }


}
