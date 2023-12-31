import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { EMessageType } from '../shared/services/IMessage';
import { UtilityService } from '../shared/services/utility.service';
import { MessageService } from '../shared/services/service-index';
import { WatchlistComponent } from './watchlist/watchlist.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  @ViewChild('panel1') firstPanel: MatExpansionPanel;
  @ViewChild('panel2') watchlistComponent: WatchlistComponent;
  isUserLoggedIn: boolean = false;
  dataSource = [];
  public forcedState = false;
  selectedTabIndex: number = 0;
  public toggleFirstPanel() {
    this.firstPanel.toggle();
  }
  constructor(
    private _utility: UtilityService,
    private _message: MessageService
  ) {}
  ngOnInit(): void {}

  onTabChanged(event: any) {
    this.selectedTabIndex = event.index;
    if (this.selectedTabIndex === 1) {
     this.watchlistComponent?.getAllSharesData;
    }
  
  }
}
