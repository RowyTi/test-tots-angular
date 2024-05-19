import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private _snackBar: MatSnackBar) {}

  openToast( message:string) {
    this._snackBar.open(message, 'Cerrar', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
