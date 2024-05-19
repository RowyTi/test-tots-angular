import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
interface ConfirmData {
  title: string
  message: string
  confirmButtonText?: string
}
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmData,
    private _modalRef: MatDialogRef<ConfirmationDialogComponent>,
  ) {
  }

  onConfirm(){
    this._modalRef.close(true);
  }
}
