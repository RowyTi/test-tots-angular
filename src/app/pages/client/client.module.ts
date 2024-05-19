import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import {TotsTableModule} from "@tots/table";
import {TotsFormModule} from "@tots/form";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    ClientComponent,
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    TotsTableModule,
    TotsFormModule,
    SharedModule,
  ]
})
export class ClientModule { }
