
import { Component, Input, OnInit } from "@angular/core";
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements OnInit {
  showModal: boolean = false;
  @Input() modalWidth: string="";

  constructor(private _utilityService: UtilityService) {}

  ngOnInit(): void {
    this._utilityService.showModal.subscribe((data:any) => {
      this.showModal = data;
    });
  }

  toggleModal(): void {
    this._utilityService.showModal.next(!this.showModal);
  }

  getClasses(): string {
    const currentWidth = parseInt(this.modalWidth);
    if ( currentWidth <= 40 ) {
      return 'modal-sm';
    } else if (currentWidth > 40 && currentWidth <= 70) {
      return 'modal-md';
    } else {
      return 'modal-lg';
    }
  }
}
