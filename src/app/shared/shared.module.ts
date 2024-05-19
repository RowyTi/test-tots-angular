import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { HeaderComponent } from './header/header.component';
@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    ConfirmationDialogComponent,
    HeaderComponent
  ]
})
export class SharedModule { }
