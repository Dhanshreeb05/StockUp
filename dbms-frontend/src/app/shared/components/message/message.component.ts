import { Component, Input, OnInit } from '@angular/core';
import { IMessage } from '../../services/IMessage';
import { MessageService } from '../../services/message.service';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  isMessageShown: boolean = false;
  message: IMessage = {
    message: 'message goes here...',
    type: 'success'
  };

  constructor(private _message: MessageService) { }

  ngOnInit(): void {
    this._message.isMessageShown.subscribe(data => {
      this.isMessageShown = data;
      if (this.isMessageShown) {
        this._message.message.subscribe(msg => {
          this.message = msg;
          this.autoClose();
        });
      }
    });
  }

  autoClose(): void {
    setTimeout(() => {
      this._message.isMessageShown.next(false);
    }, 3000);
  }

  closeMessage(): void {
    this._message.isMessageShown.next(false);
  }
}
