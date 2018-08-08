import { Injectable } from '@angular/core';
import { HttpEvent,HttpInterceptor,HttpHandler,HttpRequest,HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';
@Injectable()
export class InterceptorService implements HttpInterceptor{
 
  intercept(req:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{
      let server = 'http://192.168.100.128:8888';
    const authReq = req.clone({
      url: (server + req.url)  //对任意请求的url添加token参数   + '&token=ujusaruu19'
    });
    console.log('authReq: ' +  authReq.url);
 
    return next.handle(authReq).pipe(mergeMap((event: any) => {
        console.log('1111: ', event);
        if (event instanceof HttpResponse && event.status == 200) {
            console.log('11 22 : ErrorObservable.create  ', event);
          return ErrorObservable.create(event);
        }
        console.log('2222: ', event);
        return Observable.create(observer => observer.next(event)); //请求成功返回响应
      }),
      catchError((res: HttpResponse<any>) => {   //请求失败处理
        console.log('catchError 3333: ', res);
        switch (res.status) {
          case 401:
            console.log('401');
            break;
          case 200:
            console.log('200 业务错误');
            break;
          case 404:
            console.log('404');
            break;
          case 403:
            console.log('403 业务错误');
            break;
        }
        console.log('4444: ', event);
        console.log('5555: ', res);
        return ErrorObservable.create(res);
      }));
  }
}
