import { Component, OnInit, NgZone, OnChanges } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UtilityService } from '../../shared/services/utility.service';
import {
  EMessageType,
  LoginService,
  MessageService,
} from '../../shared/services/service-index';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { log } from 'console';
import moment from 'moment';
@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss',
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
export class WatchlistComponent implements OnInit, OnChanges {
  dataSource = [];
  columnsToDisplay = [
    'share_symbol',
    'share_sector',
    'share_name',
    'sector_cap',
    'current_share_rate',
  ];
  expandedElement: any | null;
  modalTitle: string = '';
  storeChartData: any;
  showBuyModal: boolean = false;
  showSellModal: boolean = false;
  showChartModal: boolean = false;
  showModal: boolean = false;
  buyForm: FormGroup;
  sellForm: FormGroup;
  subscription!: Subscription;
  subscription1!: Subscription;
  chartOption1: EChartsOption = {
    title: {
      text: 'Share Chart',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [],
  };
  formType: string = '';
  constructor(
    private _utility: UtilityService,
    private _message: MessageService,
    private _fb: FormBuilder,
    private _login: LoginService
  ) {}
  ngOnInit(): void {
    this._utility.showModal.next(false);
    this.initializeForm(this.formType, '', 0);
    const twoMinutes = 2 * 60 * 1000;
    this.subscription = timer(0, twoMinutes)
      .pipe(switchMap(async () => this.getUpdatedShareData()))
      .subscribe((result) => console.log(result));
    this.subscription1 = timer(0, twoMinutes)
      .pipe(switchMap(async () => this.getAllSharesData()))
      .subscribe((result) => console.log(result));

    this.getAllSharesData();
    this._utility.showModal.subscribe((data) => {
      if (!data && this.buyForm !== undefined) {
        this.buyForm.reset();
        this.showModal = false;
      }
    });
  }
  ngOnChanges(): void {
    this.getAllSharesData();
  }

  getAllSharesData(): void {
    const data = {
      p_user_id: JSON.parse(localStorage.getItem('userInfo') || '{}').user_id,
      p_watchlist_name: 'Watchlist 1',
    };
    this._utility.getAllSharesDataForUser(data).subscribe((res) => {
      if (res.status) {
        this.dataSource = res.watchlist[0];
      } else {
        alert('Could not fetch the watchlist');
      }
    });
  }

  getUpdatedShareData(): void {
    this._utility.updateShareValue().subscribe((res) => {
      if (res.status) {
        console.log(res);
      } else {
      }
    });
  }

  buyFormClear(): void {
    this.buyForm.reset();
    this.hideModal();
  }

  hideModal(): void {
    this._utility.showModal.next(false);
  }
  // sellStock(){
  //   this._utility.showModal.next(true);
  //   this.modalTitle = 'Buy Stock';
  //   this.showBuyModal = false;
  //   this.showSellModal = true;
  //   this.showChartModal = false;
  //   this.formType = 'sell';
  //   this.initializeForm(this.formType);
  //   const data = {};
  //   this._utility.sellStock(data).subscribe((res) => {
  //     if(res.status){
  //       this._message.showMessage({
  //         type: EMessageType.SUCCESS,
  //         message: res.message,
  //       });
  //     }
  //     else{
  //       this._message.showMessage({
  //         type: EMessageType.Failed,
  //         message: res.message,
  //       });
  //     }
  //   });

  // }

  toggleModal(formType: string, shareSymbol: string, sharePrice: Number): void {
    switch (formType.toLowerCase()) {
      case 'buy':
        this.showBuyModal = true;
        this.modalTitle = shareSymbol;
        this.showSellModal = false;
        this.showChartModal = false;
        this.initializeForm(formType, shareSymbol, sharePrice);
        break;
      case 'sell':
        this.showSellModal = true;
        this.modalTitle = 'Sell Stock';
        this.showBuyModal = false;
        this.showChartModal = false;
        this.initializeForm(formType, shareSymbol, sharePrice);
        break;
      case 'chart':
        this.showChartModal = true;
        this.modalTitle = 'Chart';
        this.showBuyModal = false;
        this.showSellModal = false;
        this.initializeForm(formType, shareSymbol, sharePrice);
        break;
    }
  }

  viewChart(shareName: string) {
    this._utility.showModal.next(true);
    this.modalTitle = 'Chart';
    this.showBuyModal = false;
    this.showSellModal = false;
    this.showChartModal = false;
    this._utility.getShareChartData(shareName).subscribe((res) => {
      if (res.status) {
        this.storeChartData = res.shareChart[0];
        const chartData = this.storeChartData;
        this.chartOption1 = {
          xAxis: {
            name: 'Time',
            type: 'category',
            data: chartData.map((data) => data.date_of_rate),
            axisLabel: {
              formatter: function (value) {
                return moment(value).format('HH:mm');
              },
            },
          },
          yAxis: {
            name: 'Price',
            type: 'value',
          },
          series: [
            {
              data: chartData.map((data) => data.todays_rate),
              type: 'line',
            },
          ],
        };
      } else {
        this._message.showMessage({
          type: EMessageType.Failed,
          message: res.message,
        });
      }
    });
  }

  initializeForm(
    formType: string,
    shareSymbol: string,
    sharePrice: Number
  ): void {
    switch (formType.toLowerCase()) {
      case 'buy':
        this.buyForm = this._fb.group({
          shareSymbol: [shareSymbol, [Validators.required]],
          quantity: ['', [Validators.required, Validators.min(1)]],
          price: [sharePrice, [Validators.required, Validators.nullValidator]],
          buytrigger: [sharePrice, [Validators.required]],
        });

        break;
      case 'sell':
        this.sellForm = this._fb.group({
          shareSymbol: [shareSymbol, [Validators.required]],
          quantity: ['', [Validators.required]],
          price: [
            sharePrice,
            [Validators.required, Validators.nullValidator, Validators.min(1)],
          ],
        });
        break;
      case 'chart':
        break;
    }
    this._utility.showModal.next(true);
  }
  get f(): { [key: string]: AbstractControl } {
    return this.buyForm.controls;
  }

  buyProvidedShare(): void {
    let share = {
      user_id: JSON.parse(localStorage.getItem('userInfo') || '{}').user_id,
      share_symbol: this.buyForm.value.shareSymbol,
      transaction_type: 'BUY',
      buy_rate: parseFloat(this.buyForm.value.buytrigger),
      quantity: parseInt(this.buyForm.value.quantity),
    };
    this._utility.buyStock(share).subscribe((res) => {
      if (res.status) {
        this._message.showMessage({
          type: EMessageType.SUCCESS,
          message: res.message,
        });
        this.buyForm.reset();
        this.hideModal();
      } else {
        this._message.showMessage({
          type: EMessageType.Failed,
          message: res.message,
        });
        alert('The stock could not be bought');
      }
    });
  }

  deleteStockFromWatchList(share: any): void {
    let user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    let request = {
      share_symbol: share,
      user_id: user.user_id,
      watchlist_name: 'Watchlist 1',
    };
    this._utility.deleteShareFromWatchList(request).subscribe((res) => {
      if (res.status) {
        alert('The stock has been deleted from the watchlist');
        this.getAllSharesData();
      } else {
        alert('The stock could not be deleted from the watchlist');
      }
    });
  }
}
