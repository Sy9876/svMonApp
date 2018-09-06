import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MsgDetailPage } from './msg-detail';

@NgModule({
  declarations: [
    MsgDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MsgDetailPage),
  ],
})
export class MsgDetailPageModule {}
