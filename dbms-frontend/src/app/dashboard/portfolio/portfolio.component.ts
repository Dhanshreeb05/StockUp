import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { UtilityService } from '../../shared/services/utility.service';
import { EMessageType, MessageService } from '../../shared/services/service-index';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, timer, switchMap } from 'rxjs';
import * as echarts from "echarts";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
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
export class PortfolioComponent implements OnInit {
  dataSource = [];
  columnsToDisplay = [
    'share_rate_bought',
    'share_symbol',
    'quantity',
    'current_share_rate',
    'profit',
   
  ];
  expandedElement: any | null;
  modalTitle: string = '';
  showBuyModal: boolean = false;
  showSellModal: boolean = false;
  showChartModal: boolean = false;
  showModal: boolean = false;
  buyForm: FormGroup;
  sellForm: FormGroup;
  subscription!: Subscription;

  formType: string = '';
  constructor(
    private _utility: UtilityService,
    private _message: MessageService,
    private _fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this._utility.showModal.next(false);
    this.initializeForm(this.formType, '', 0);
    const fiveMinutes = 5 * 60 * 1000;
    this.subscription = timer(0, fiveMinutes)
      .pipe(switchMap(async () => this.getPortfolioData()))
      .subscribe((result) => console.log(result));
    this.getPortfolioData();
    this._utility.showModal.subscribe((data) => {
      if (!data && this.buyForm !== undefined) {
        this.buyForm.reset();
        this.showModal = false;
      }
    });
  }
  ngOnChanges(): void {

    this.getPortfolioData();
  }

  getPortfolioData(): void {
    const data = {
      p_user_id: JSON.parse(localStorage.getItem('userInfo') || '{}').user_id,
    };
    this._utility.getPortfolioData(data).subscribe((res) => {
      if (res.status) {
        this.dataSource = res.portfolio[0];
      } else {
        alert('Error in fetching data');
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
        this.modalTitle = shareSymbol;
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
    this.showChartModal = true;
    this._utility.getShareChartData(shareName).subscribe((res) => {
      if (res.status) {
        // this._message.showMessage({
        //   type: EMessageType.SUCCESS,
        //   message: res.message,
        // });
        // const chartData = res.chartData;
        // const chartOptions: EChartsOption = {
        //   xAxis: {
        //     type: 'category',
        //     data: chartData.map((data) => data.date),
        //   },
        //   yAxis: {
        //     type: 'value',
        //   },
        //   series: [
        //     {
        //       data: chartData.map((data) => data.close),
        //       type: 'line',
        //     },
        //   ],
        // };
        // const chart = echarts.init(document.getElementById('chart'));
        // chart.setOption(chartOptions);
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
          selltrigger: [sharePrice, [Validators.required]],
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
        alert('Stock bought successfully');
        this.buyForm.reset();
        this.hideModal();
        this.getPortfolioData();
      } else {
        alert('Stock not bought');
      }
    });
  }
  sellProvidedShare(): void {
    let share = {
      user_id: JSON.parse(localStorage.getItem('userInfo') || '{}').user_id,
      share_symbol: this.sellForm.value.shareSymbol,
      transaction_type: 'SELL',
      sell_rate: parseFloat(this.sellForm.value.selltrigger),
      quantity: parseInt(this.sellForm.value.quantity),
    };
    this._utility.sellStock(share).subscribe((res) => {
      if (res.status) {
       alert('Stock sold successfully');
        this.sellForm.reset();
        this.hideModal();
        this.getPortfolioData();
      } else {
        alert(res.message.toString());
      }
    });
  }
}

