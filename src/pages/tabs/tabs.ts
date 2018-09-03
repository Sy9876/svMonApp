import { Component } from '@angular/core';

import { SvListPage } from '../svlist/svlist';
import { ConfigPage } from '../config/config';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = SvListPage;
  tab3Root = ConfigPage;

  constructor() {

  }
}
