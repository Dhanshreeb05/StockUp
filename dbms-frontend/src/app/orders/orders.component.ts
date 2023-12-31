import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../shared/services/utility.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
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
export class OrdersComponent implements OnInit {
  dataSource = [];
  constructor(private _utility: UtilityService) {}
  columnsToDisplay=[
    'order_id',
    'user_id',
    'share_symbol',
    'transaction_type',
    'rate',
    'order_status',
    'quantity	',
    'order_date',

  ];
  ngOnInit(): void {
    this.getAllOrderdetails();
  }

  cancelOrder(order_id: number): void {
    let data = {
      p_order_id: order_id,
    };
    this._utility.cancelOrder(data).subscribe((res) => {
      if (res.status) {
        alert('Order cancelled successfully');
        this.getAllOrderdetails();
      } else {
        alert('Error in cancelling order');
      }
    });
  }

  getAllOrderdetails(): void {
    let data = {
      p_user_id: JSON.parse(localStorage.getItem('userInfo') || '{}').user_id,
    };
    this._utility.getAllOrderdetails(data).subscribe((res) => {
      if (res.status) {
        this.dataSource = res.orders;
      } else {
        alert('Error in fetching data');
      }
    });
  }
}
