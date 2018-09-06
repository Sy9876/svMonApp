import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DaoService {

  db: SQLiteObject = null;

  constructor(platform: Platform,
    private sqlite: SQLite) {

   platform.ready().then(() => {
     console.log('DaoService start. on platform.ready. open sqlite db.');
     
     this.createSqliteDb();
    // this.selfTest();
     
   });
 }

 getDbObj(): SQLiteObject {
    return this.db;
 }

 insertMsg(msgObj:any, cb: Function): void {
  console.log('insertMsg');

  let sqlStr = 
    'insert into mon_msg (serverName, reportTimestamp, status, msgShort, msgDetail) '
    + ' values (?, ?, ?, ?, ?);'
    ;
  let params: any = [];
  params.push(msgObj.serverName);
  if(msgObj.reportDate) {
    // 保存时间戳
    let x = typeof(msgObj.reportDate);
    console.log('insertMsg. typeof msgObj.reportDate is :' + x);
    console.log('insertMsg. msgObj.reportDate is :' + msgObj.reportDate);
    let ts: number = 0;
    if(x=='string') {
      let d = new Date(x);
      ts = d.getTime();
    }
    else {
      ts = msgObj.reportDate.getTime();
    }
    console.log('insertMsg. ts is :' + ts);
    params.push(ts);
  }
  else {
    params.push(null);
  }
  params.push(msgObj.status);
  params.push(msgObj.msgShort);
  params.push(msgObj.msgDetail);

  this.db.executeSql(sqlStr, params).then((rs) => {
    console.log('Executed sqlStr SQL done.');
    cb(rs);
  })
  .catch(e => {
    console.log(e);
    console.log('insertMsg. showObj e:');
    this.showObj(e);
    console.log('insertMsg. showObj e.rows.item(0):');
    this.showObj(e.rows.item(0));
  });

 }

 countMsg(cb: Function): void {
  console.log('countMsg');

  let sqlStr = 'select count(1) as cnt from mon_msg';

  console.log('this.db is: ' + this.db);

  this.db.executeSql(sqlStr)
  .then((rs) => {
    console.log('Executed sqlStr SQL done. ' + rs.rows.item(0));
    cb(rs.rows.item(0));
  })
  .catch(e => {
    console.log('Executed sqlStr SQL error.')

    this.showObj(e.rows.item(0)['cnt']);


    // console.log(e.message)
    cb(e.rows.item(0)['cnt']);

    


  });

 }

 selectMsg(cb: Function): void {
  console.log('selectMsg');

  let sqlStr = `select id, serverName, reportTimestamp, status, msgShort, msgDetail
    from mon_msg
    order by reportTimestamp desc
    `;

  this.db.executeSql(sqlStr)
  .then((rs) => {
    console.log('Executed sqlStr SQL done.');
    cb(rs);
  })
  .catch(e => console.log(e));

 }

 createSqliteDb(): void {

   let createDbSql = `
    create table if not exists mon_msg (
      id integer primary key autoincrement,
      serverName varchar(32),
      reportTimestamp integer,
      status varchar(10),
      msgShort varchar(100),
      msgDetail varchar(65535)
    );
   `;

   createDbSql = `SELECT COUNT(*) FROM sqlite_master WHERE type='table'`

   console.log('createSqliteDb. 100 sqlite.create start.');
   this.sqlite.create({
     name: 'svmon.db',
     location: 'default'
   })
    .then((db: SQLiteObject) => {

      console.log('createSqliteDb. 200 sqlite.create done. got db object. do executeSql');
      console.log('createSqliteDb. 210 do executeSql. ' + createDbSql);
      console.log('createSqliteDb. 220 db：' + db);

      db.executeSql(createDbSql)
        .then(() => {
          console.log('300 Executed createDbSql SQL done.');
          this.db = db;
        })
        .catch(e => {
          this.db = db;
          console.log('400 Executed createDbSql SQL error.');
          console.log('401 Executed createDbSql SQL error. e.rows.item(0)=' + e.rows.item(0));
          console.log('401 Executed createDbSql SQL error. json=' + JSON.stringify(e));
          console.log('401 Executed createDbSql SQL error. json=' + JSON.stringify(e.rows.item(0)));

          // for(var p in e) {
          //   console.log('410 p: ' + p + ' v: ' + e[p]);
          // }
          this.showObj(e);
          // console.log(e.toString())
        });


    })
    .catch(e => {
      console.log('500 createSqliteDb. sqlite.create error.');
      console.log(e)
    });
 }


 
 selfTest(): void {

  console.log('selfTest. 100 sqlite.selfTest start.');
  this.sqlite.selfTest()
   .then((db: SQLiteObject) => {

     console.log('selfTest. 200 sqlite.selfTest done.');
     console.log('selfTest. 220 db：' + db);


   })
   .catch(e => {
     console.log('500 selfTest. sqlite.create error.');
     console.log(e)
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
}
