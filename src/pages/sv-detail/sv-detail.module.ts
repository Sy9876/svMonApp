import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SvDetailPage } from './sv-detail';

@NgModule({
  declarations: [
    SvDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SvDetailPage),
  ],
})
export class SvDetailPageModule {}
