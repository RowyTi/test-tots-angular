import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ClientService} from "../../services/client.service";
import {
  TotsActionTable, TotsIconButtonColumn,
  TotsStringColumn,
  TotsTableComponent,
  TotsTableConfig
} from "@tots/table";
import {TotsListResponse, TotsQuery} from "@tots/core";
import {delay, filter, of, Subject, switchMap, takeUntil, tap} from "rxjs";
import {Client} from "../../entities/client";
import {
  StringFieldComponent,
  SubmitButtonFieldComponent,
  TotsFormModalService,
  TotsModalConfig
} from "@tots/form";
import {Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../../shared/confirmation-dialog/confirmation-dialog.component";
import {ToastService} from "../../services/toast.service";
import {PageEvent} from "@angular/material/paginator";
import {ACTIONS} from "../../constants/actions.constants";
import {TotsApiPagination} from "../../interfaces/api.interface";

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit, OnDestroy {
  @ViewChild('tableComp') tableComp!: TotsTableComponent;
  private _unsubscribeAll: Subject<any> = new Subject();
  config = new TotsTableConfig();
  pagination!: TotsApiPagination

  constructor(
    private readonly _clientService: ClientService,
    private readonly _modalService: TotsFormModalService,
    private readonly _matDialog: MatDialog,
    private readonly _toastService: ToastService
  ) {
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null)
    this._unsubscribeAll.complete()
  }

  ngOnInit(): void {
    this.config.id = 'client-table';

    this.config.columns = [
      new TotsStringColumn("firstname", "firstname", "Nombre"),
      new TotsStringColumn("lastname", "lastname", "Apellido"),
      new TotsStringColumn("email", "email", "Email"),
      new TotsIconButtonColumn("delete", "delete", "delete", "warn", '', ''),
      new TotsIconButtonColumn("edit", "edit", "edit", "primary", '', ''),
    ];

    let data = new TotsListResponse();
    this._clientService.clients$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(clients => {
        // console.log('clients$')
        data.data = [...clients];
      })
    this._clientService.pagination$
      .subscribe(pagination => {
        // console.log('pagination$')
        this.pagination = pagination
        data = {...data, ...pagination}
        this.config.obs = of(data).pipe(delay(500));
      })
  }

  /**
   * Reducer de acciones de la tabla
   * @param key accion
   * @param item payload
   */
  onTableAction({key, item}: TotsActionTable): void {
    switch (key) {
      case ACTIONS.EDIT:
        this.onEdit(item)
        break;
      case ACTIONS.DELETE:
        this.onDelete(item)
        break;
      case ACTIONS.PAGE_CHANGE:
        this.onPageChange(item)
        break;
      case ACTIONS.LOADED_ITEMS:
        break;
      default:
        console.error(`Action ${key} no implementado`)
        break;
    }
  }

  /**
   * Edita una cliente
   * @param item
   */
  onEdit(item: Client) {
    this._clientService.fetchById(item.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(client => {
        this.onOpenModal(client)
      })
  }

  /**
   * Elimina el cliente seleccionado
   * @param item
   */
  onDelete(item: Client) {
    const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Eliminar ${item.firstname} ${item.lastname}`,
        message: '¿Está seguro que desea eliminar este cliente?'
      },
      width: '500px'
    })
    dialogRef.afterClosed()
      .pipe(
        filter(confirm => confirm),
        takeUntil(this._unsubscribeAll),
        switchMap(() => this._clientService.removeById(item.id))
      )
      .subscribe(_ => {
        this._toastService.openToast('Cliente eliminado correctamente')
        this.tableComp.loadItems();
      })
  }

  /**
   * Abre el modal para crear un cliente nuevo
   */
  onCreate(): void {
    this.onOpenModal()
  }

  /**
   * Paginacion
   * @param pageEvent
   */
  onPageChange(pageEvent: PageEvent): void {
    const query = new TotsQuery()
    query.page = pageEvent.pageIndex + 1
    query.per_page = pageEvent.pageSize

    this._clientService.list(query).subscribe()
    this.tableComp.loadItems();
  }

  /**
   * Abre el modal para crear o editar un cliente
   * y realizar la acción correspondiente
   * @param item
   */
  onOpenModal(item?: Client) {
    const errors = [
      {name: 'required', message: 'Este campo es requerido'},
      {name: 'email', message: 'Debes ingrasar un email valido'}
    ]
    let config = new TotsModalConfig()
    config.title = item ? `Editar ${item.firstname} ${item.lastname}` : 'Crear nuevo cliente'
    config.autoSave = false;
    config.item = item ?? {};
    config.fields = [
      {key: 'firstname', component: StringFieldComponent, label: 'Nombre', validators: [Validators.required], errors},
      {key: 'lastname', component: StringFieldComponent, label: 'Apellido', validators: [Validators.required], errors},
      {key: 'email', component: StringFieldComponent, label: 'Email', validators: [Validators.required, Validators.email], errors},
      {key: 'address', component: StringFieldComponent, label: 'Dirección', validators: [Validators.required], errors},
      {key: 'submit', component: SubmitButtonFieldComponent, label: item ? 'Actualizar' : 'Guardar'}
    ];
    this._modalService.open(config)
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter(action => action.key === ACTIONS.SUBMIT),
        tap(action => action?.modal?.componentInstance.showLoading()),
        switchMap(action => {
          const subscription = item?.id
            ? this._clientService.update(action.item)
            : this._clientService.create(action.item);

          return subscription.pipe(
            tap(client => {
              // TODO: modificaria la respuesta de API, retornando ya el mensaje y el toast ejecutarlo desde el servicio
              this._toastService.openToast(item
                ? `Cliente ${client.firstname} ${client.lastname} actualizado correctamente`
                : `Cliente ${client.firstname} ${client.lastname} creado correctamente`);
              action?.modal?.close();
              this.tableComp.loadItems();
            })
          );
        }),

      ).subscribe()
  }
}
