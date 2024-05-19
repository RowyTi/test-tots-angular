import {Inject, inject, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ClientComponent} from "./client.component";
import {TotsQuery} from "@tots/core";
import {ClientService} from "../../services/client.service";

const clientResolve= () => {
  const clientService = inject(ClientService)
  const query = new TotsQuery()
  query.page = 1
  query.per_page = 10
  return clientService.list(query)
}
const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    resolve: {
      clients: clientResolve
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule {
}
