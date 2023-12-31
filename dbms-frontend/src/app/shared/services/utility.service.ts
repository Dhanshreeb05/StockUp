import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  showFullScreenModal = new BehaviorSubject<boolean>(false);
  showModal = new BehaviorSubject<boolean>(false);
  subscription !: Subscription;
  list: any = new BehaviorSubject([]);

  constructor(private _http: HttpClient) {}

  //API for getting all the shares
  getAllSharesData(): Observable<any> {
    return this._http.get<any>('http://localhost:8085/api/shares/getAllShares');
  }

  // API for setting the user details for the bank account
  setBankAccount(data: any): Observable<any> {

    return this._http.post<any>(
      'http://localhost:8085/api/user/addBankAccount',
      data
    );
  }

  buyStock(data:any): Observable<any> {
    return this._http.post<any>('http://localhost:8085/api/shares/buys',data);
  }
  sellStock(data: any): Observable<any> {
    return this._http.post<any>('http://localhost:8085/api/shares/sells', data);
  }
  getShareDetails(data: any): Observable<any> {
    return this._http.post<any>(
      'http://localhost:8085/api/shares/getShareDetails',
      data
    );
  }

  getShareChartData(data: any): Observable<any> {
    let req={
      data:data
    }
    return this._http.post<any>(
      'http://localhost:8085/api/shares/getShareChartData',
      req
    );
  }

  addToWatchList(data: any): Observable<any> {
    return this._http.post<any>(
      'http://localhost:8085/api/shares/addToWatchList',
      data
    );
  }

  deleteShareFromWatchList(data: any): Observable<any> {
    return this._http.post<any>(
      'http://localhost:8085/api/shares/deleteStockFromWatchList',
      data
    );
  }

  getAllSharesDataForUser(data:any): Observable<any> {
    return this._http.post<any>(
      'http://localhost:8085/api/shares/getWatchList',data
    );
  }

  getPortfolioData(data:any): Observable<any> {


    return this._http.post<any>(
      'http://localhost:8085/api/shares/getPortfolio',data
    );
  }

  getTransactionsTable(data:any): Observable<any> {
    return this._http.post<any>(
      'http://localhost:8085/api/shares/getTransactionsTable',data
    );
  }

  getMostProfitable(data:any): Observable<any> {
    return this._http.post<any>(
      'http://localhost:8085/api/shares/getMostProfitable',data
    );
  }

  getportfolioProfit(data:any): Observable<any> {
    return this._http.post<any>(
      'http://localhost:8085/api/shares/calculatePortfolioProfit',data
    );
  }

  getPortfolioValue(data:any): Observable<any> {
    return this._http.post<any>(
      'http://localhost:8085/api/shares/calculateRealisedProfit',data
    );
  }

  getAllOrderdetails(data:any): Observable<any> {
    return this._http.post<any>(
      'http://localhost:8085/api/shares/getAllOrders',data
    );
  }

  cancelOrder(data:any): Observable<any> {
    return this._http.post<any>(
      'http://localhost:8085/api/shares/cancelOrder',data
    );
  }

  getNewsletters(data:any): Observable<any> {
    return this._http.post<any>('http://localhost:8085/api/shares/getNewsletters',data);
  }

  getNews(data:any): Observable<any> {
    return this._http.post<any>('http://localhost:8085/api/getNews',data);
  }

  getUserBalance(data:any): Observable<any> {
    return this._http.post<any>('http://localhost:8085/api/shares/getUserBalance',data);
  }

  updateShareValue(): Observable<any> {
    return this._http.get<any>('http://localhost:8085/api/shares/updateShareValue');
  }

  getNews(data:any): Observable<any> {
    return this._http.post<any>(
      'http://localhost:8085/api/getNews',data
    );
  }

}
