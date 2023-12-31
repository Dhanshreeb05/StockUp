import { Injectable } from '@angular/core';
import { IMessage } from './IMessage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  isMessageShown = new BehaviorSubject<boolean>(false);
  message = new BehaviorSubject<IMessage>({});

  constructor() { }

  showMessage(message: IMessage): void {
    this.isMessageShown.next(true);
    this.message.next(message);
  }

  hideMessage(): void {
    this.isMessageShown.next(false);
  }
}
