#!/usr/bin/env python
#-*- coding:utf8 -*-

import logging
import sys
import os
import subprocess
import signal
import re
import time
import thread
from datetime import datetime
import jpushSender


LOGFILE='./sv_status_report.log'
LOGLEVEL=logging.DEBUG
#LOGLEVEL=logging.INFO
logging.basicConfig(level=LOGLEVEL,
                format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S',
                filename=LOGFILE,
                filemode='a')
# logger = logging.getLogger()

# register signal handler for CTRL-C
isLoop=True
def handler_sigint(signum, frame):
    global isLoop
    logging.info('got SIGINT')
    #print 'got SIGINT'
    if isLoop:
        isLoop=False
        thread.interrupt_main()

signal.signal(signal.SIGINT, handler_sigint)
# ignore sighup, keep running when terminal disconnect
signal.signal(signal.SIGHUP, signal.SIG_IGN)

gAlertMap={}
def getDateStr():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def runCmd(c):
  p=subprocess.Popen(c, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
  #while True:
    #line=p.stdout.readline()
    #if not line:
    #  break
    #print line,
  return p.stdout.readlines()

def checkUpt():
  ''' sample out put of uptime:
  14:09:03 up 32 days, 18 min,  2 users,  load average: 1.29, 1.59, 1.57
  '''
  ALERT_VAVLE_UPT=4
  alertType='upt'
  isErr=False
  alertMsg=None
  alertMsgList=[]
  logmsg="%s %s" % (getDateStr(), 'checkUpt start')
  logging.info(logmsg)
  #print getDateStr(), ' checkMycatIdx start'
  lines=runCmd('uptime')

  for line in lines:
    line=line.strip('\n')
    logging.debug('checkUpt got line: %s', line)
    #print line,
    m=re.search(r'load average:\s+([0-9.]+),\s+([0-9.]+),\s+([0-9.]+)', line)
    if m:
      la1=m.groups()[0]
      la5=m.groups()[1]
      la15=m.groups()[2]
      logmsg="checkUpt vavle=%d la1=%s la5=%s la15=%s" % (ALERT_VAVLE_UPT, la1, la5, la15)
      logging.debug(logmsg)
      if float(la1)>ALERT_VAVLE_UPT or float(la5)>ALERT_VAVLE_UPT or float(la15)>ALERT_VAVLE_UPT:
        isErr=True
        alertMsgList.append(line)
    else:
      logging.error('checkUpt unmatch')

  #if not isErr:
  if isErr:
    newts=time.time()
    alertMsg="%s %s\n%s\n" % (getDateStr(), '[WARN] cpu load average high', '\n'.join(alertMsgList))
    logging.debug(alertMsg)

  logmsg="%s %s" % (getDateStr(), 'checkUpt end')
  logging.info(logmsg)
  return alertMsg


def checkMem():
  ''' sample out put of free -m:
               total      used         free         shared   buffers   cached
  Mem:         15952      15591        361          0        136       2805
  '''
  ALERT_VAVLE_MEM=1000
  alertType='mem'
  isErr=False
  alertMsg=None
  alertMsgList=[]
  logmsg="%s %s" % (getDateStr(), 'checkMem start')
  logging.info(logmsg)
  lines=runCmd('free -m')

  for line in lines:
    line=line.strip('\n')
    logging.debug('checkMem got line: %s', line)
    #print line,
    m=re.search(r'Mem:\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)', line)
    if m:
      fields=line.split()
      if len(fields)!=8:
        logging.error('checkMem bad line: %s size=%d', line, len(fields))
        continue
      vTotal=fields[2]
      vUsed=fields[3]
      vFree=fields[4]
      vBuffers=fields[6]
      vCached=fields[7]
      iAvaliable=int(vFree) + int(vBuffers) + int(vCached)
      # alert if avaliable memory less than 1G
      logging.debug('checkMem avaliable memory is %d', iAvaliable)
      if iAvaliable < ALERT_VAVLE_MEM:
        isErr=True
        alertMsgList.append(line)

  #if not isErr:
  if isErr:
    newts=time.time()
    alertMsg="%s %s\n%s\n" % (getDateStr(), '[WARN] free memory low', '\n'.join(alertMsgList))
    logging.debug(alertMsg)

  logmsg="%s %s" % (getDateStr(), 'checkMem end')
  logging.info(logmsg)
  return alertMsg


def checkDsk():
  ''' sample out put of dsk.sh:
  /dev/mapper/vg00-lv_root   91G   58G   29G  67% /
  '''
  ALERT_VAVLE_USED=80
  alertType='dsk'
  isErr=False
  alertMsg=None
  alertMsgList=[]
  logmsg="%s %s" % (getDateStr(), 'checkDsk start')
  logging.info(logmsg)
  #print getDateStr(), ' checkMycatIdx start'
  lines=runCmd('df -h |grep -v /docker/')

  for line in lines:
    line=line.strip('\n')
    logging.debug('checkDsk got line: %s', line)
    #print line,
    m=re.search(r'\s+([0-9]+)%\s+/$', line)
    if m:
      vUsed=m.groups()[0]
      logging.debug('checkDsk disk usage is %s%%', vUsed)
      if int(vUsed)>ALERT_VAVLE_USED:
        isErr=True
        alertMsgList.append(line)

  #if not isErr:
  if isErr:
    newts=time.time()
    alertMsg="%s %s\n%s\n" % (getDateStr(), '[WARN] disk usage high', '\n'.join(lines))
    logging.debug(alertMsg)

  logmsg="%s %s" % (getDateStr(), 'checkDsk end')
  logging.info(logmsg)
  return alertMsg


def alert(serverName, svStatus, shortMsg, msg):
  #cmd="%s \"%s\"" % (SHELL_REDIS_PUT_MSG, msg)
  #runCmd(cmd)
  notiObj = jpushSender.createNotification(serverName, svStatus, shortMsg, msg)
  
  # # get alias send to
  # if len(sys.argv) > 2:
  #   # get from argv
  #   aliasToArgv = sys.argv[2]
  #   for aliasTo in aliasToArgv.split(','):
  #     jpushSender.addAlias(aliasTo, notiObj)

  jpushSender.pushApi(notiObj)

if __name__ == '__main__':
  logging.info('start')
  #for arg in sys.argv:
  #    print 'arg: %s' % arg

  # # get server name
  # if len(sys.argv) > 1:
  #   # get from argv
  #   serverName = sys.argv[1]
  # else:
  #   # get hostname
  #   serverName = runCmd('hostname')[0].strip('\n')

  # logging.info('serverName is ' + serverName)

  serverName=""

  retMsg=None
  alertMsgList=[]
  svStatus="OK"
  try:
    retMsg=checkUpt()
    if retMsg:
      svStatus="WARN"
      alertMsgList.append(retMsg)
    else:
      alertMsgList.append('uptime check passed.')

    retMsg=checkMem()
    if retMsg:
      svStatus="WARN"
      alertMsgList.append(retMsg)
    else:
      alertMsgList.append('free memory check passed.')

    retMsg=checkDsk()
    if retMsg:
      svStatus="WARN"
      alertMsgList.append(retMsg)
    else:
      alertMsgList.append('disk check passed.')

    if alertMsgList:
      logging.info('alert')
      alert(serverName, svStatus, svStatus, '\n'.join(alertMsgList))
  except KeyboardInterrupt:
    logging.info('KeyboardInterrupt')
    #print 'KeyboardInterrupt'
  finally:
    logging.info('end')
