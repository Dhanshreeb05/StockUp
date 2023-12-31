import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../shared/services/utility.service';
import { log } from 'console';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.scss',
})
export class InsightsComponent implements OnInit {
  portfolioValue: string = '';
  portfolioProfit: string = '';
  mostProfitable: string = '';
  mostProfitableName: string = '';
  balance: string = '';
  datasource = [];
  columnNames: any;
  constructor(private _utility: UtilityService) {}
  data = {
    p_user_id: JSON.parse(localStorage.getItem('userInfo') || '{}').user_id,
  };
  ngOnInit(): void {
    this.getTransactionsTable();
    this.getMostProfitable();
    this.getportfolioProfit();
    this.getPortfolioValue();
    this.getUserBalance();
  }
  getTransactionsTable(): void {
    this._utility.getTransactionsTable(this.data).subscribe((res) => {
      if (res.status) {
        this.datasource = res.transactions[0];
        let columns = this.datasource[0];
        this.columnNames = Object.keys(columns);
      } else {
        alert('Error in fetching data');
      }
    });
  }
  getMostProfitable(): void {
    this._utility.getMostProfitable(this.data).subscribe((res) => {
      if (res.status) {
        let arr = [];
        arr = res.mostProfitable[0];

        this.mostProfitableName = arr[0]?.share_symbol;
        this.mostProfitable = arr[0]?.total_profit;
      } else {
        alert('Error in fetching data');
      }
    });
  }
  getportfolioProfit(): void {
    this._utility.getportfolioProfit(this.data).subscribe((res) => {
      if (res.status) {
        let object = [];
        object = Object.values(res.portfolioProfit[0]);

        this.portfolioProfit = object[0];
      } else {
        alert('Error in fetching data');
      }
    });
  }
  getPortfolioValue(): void {
    this._utility.getPortfolioValue(this.data).subscribe((res) => {
      if (res.status) {
        let object = [];
        object = Object.values(res.realisedProfit[0]);
        this.portfolioValue = object[0];
      } else {
        alert('Error in fetching data');
      }
    });
  }
  getUserBalance(): void {
    this._utility.getUserBalance(this.data).subscribe((res) => {
      if (res.status) {
        this.balance = res.balance[0].account_balance;
      } else {
        alert('Error in fetching data');
      }
    });
  }
}
