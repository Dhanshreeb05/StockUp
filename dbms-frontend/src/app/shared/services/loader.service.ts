import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isLoading = new BehaviorSubject<boolean>(false);
  private loaderUpdate = new EventEmitter<boolean>();

  constructor() { }

  toggleLoader(status: boolean): void {
    this.isLoading.next(status);
  }

  getLoaderListner() {
    return this.loaderUpdate.asObservable();
  }

  update(val: boolean) {
    this.loaderUpdate.next(val);
  }
}
