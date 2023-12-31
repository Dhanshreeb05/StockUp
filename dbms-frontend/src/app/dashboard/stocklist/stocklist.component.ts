import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UtilityService } from '../../shared/services/utility.service';
import { MessageService } from '../../shared/services/message.service';
import { EMessageType } from '../../shared/services/service-index';

@Component({
  selector: 'app-stocklist',
  templateUrl: './stocklist.component.html',
  styleUrl: './stocklist.component.scss',
})
export class StocklistComponent implements OnInit {
  displayedColumns: string[] = [
    'share_symbol',
    'share_name',
    'share_sector',
    'sector_cap',
    'current_share_rate',
    'Add',
  ];
  @Input() dataSource: any;

  dataSourceTable = new MatTableDataSource();

  constructor(
    private _utility: UtilityService,
    private _message: MessageService
  ) {}
  ngOnInit(): void {
;
    this.getAllSharesData();
  }
  getAllSharesData() {
    this._utility.getAllSharesData().subscribe((res) => {
      if (res.status) {
        this._message.showMessage({
          type: EMessageType.SUCCESS,
          message: res.message,
        });
        this.dataSourceTable = new MatTableDataSource(res.shares);
      } else {
        this._message.showMessage({
          type: EMessageType.Failed,
          message: res.message,
        });
      }
    });
  }
  onButtonClick(share: any) {
    let user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    let request = {
      share_symbol: share.share_symbol,
      user_id: user.user_id,
      watchlist_name: 'Watchlist 1',
    };
    // Handle button click for the specific row
    this._utility.addToWatchList(request).subscribe((res) => {
      if (res.status) {
        console.log(res);
        //call api for adding to watchlist
        
      } else {
        console.log(res);
      }
    });
  }
}
