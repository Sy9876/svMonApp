#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import json
from urllib2 import urlopen, Request
from urllib import urlencode
import time
import logging
import ConfigParser

url = "https://api.jpush.cn/v3/push"
base64EncodedStr = ""
jpushConfigPath = "jpushConfig.ini"


def addAlias(alias, notificationObj):
    if 'alias' in  notificationObj['audience']:
        pass
    else:
        notificationObj['audience'] = {
            'alias': []
        }
    notificationObj['audience']['alias'].append(alias)


def createNotification(serverName, status, msgShort, msgDetail):

    global base64EncodedStr

    # load config
    try:
        cf=ConfigParser.ConfigParser()
        cf.read(jpushConfigPath)
        base64EncodedStr=cf.get('main','auth_base64')
        serverName=cf.get('main','server_name')
        sendTo=cf.get('main','send_to')
        # logging.info('base64EncodedStr: %s', base64EncodedStr)
    except Exception as err:
        # print err
        logging.error(err)
        raise err


    reportDate = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) 
    
    msgDetail = {
        "serverName": serverName,
        "reportDate": reportDate,
        "status": status,
        "msgShort": msgShort,
        "msgDetail": msgDetail
    }
    reqObj = {
        "platform": "all",
        "audience": "all",
        "notification": {
            "alert": msgDetail
        }
    }

    if sendTo == 'all':
        pass
    else:
        for aliasTo in sendTo.split(','):
            addAlias(aliasTo, reqObj)

    return reqObj


def pushApi(notificationObj):
    global base64EncodedStr

    try:

        reqStr = json.dumps(notificationObj)
        # print reqStr
        logging.info('reqStr: %s', reqStr)
        # logging.info('base64EncodedStr: %s', base64EncodedStr)
        headers = {
            "Content-Type": "application/json;charset:utf-8",
            "Authorization": "Basic " + base64EncodedStr
        }
        request = Request(url=url, data=reqStr, headers=headers)

        logging.info('%s', "---- send request ---- ")
        res = urlopen(request)
        data = res.read()
        logging.info('%s', "---- send response ---- ")
        logging.info('%s', data)


    except Exception as err:
        # print err
        logging.error(err)



########## main ##################
if __name__ == '__main__':
    notiObj = createNotification("test", "OK", "status report", "")
    pushApi(notiObj)

