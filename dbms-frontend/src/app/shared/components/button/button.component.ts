import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() type: string | any = 'raised';
  @Input() classes: string | any = '';
  @Input() data: any;
  @Input() label: string | any = 'test';
  @Input() icon: string | any;
  @Input() isDisabled: boolean = false;
  @Output() userAction = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  handleAction(): void {
    this.userAction.emit(this.data);
  }
}
