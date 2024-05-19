import {Inject, Injectable} from '@angular/core';
import {Client} from '../entities/client';
import {HttpClient} from '@angular/common/http';
import {TOTS_CORE_PROVIDER, TotsBaseHttpService, TotsCoreConfig, TotsListResponse, TotsQuery} from '@tots/core';
import {BehaviorSubject, map, Observable, of, switchMap, tap, throwError} from "rxjs";
import {TotsApiPagination, TotsApiResponse} from "../interfaces/api.interface";

@Injectable({
  providedIn: 'root'
})
export class ClientService extends TotsBaseHttpService<Client> {
  // @ts-ignore
  private _clients: BehaviorSubject<Client[]> = new BehaviorSubject(null)
  // @ts-ignore
  private _pagination: BehaviorSubject<TotsApiPagination> = new BehaviorSubject(null)

  constructor(
    @Inject(TOTS_CORE_PROVIDER) protected override config: TotsCoreConfig,
    protected override http: HttpClient,
  ) {
    super(config, http);
    this.basePathUrl = `${this.config.baseUrl}client`;
  }

  //Accessors
  get clients$(): Observable<Client[]> {
    return this._clients.asObservable();
  }

  get pagination$() :Observable<TotsApiPagination> {
    return this._pagination.asObservable();
  }

  /**
   * Get list of clients
   * Deberia ser GET y utilizar queryParams? entiendo que `TotsQuery` seria mas util por parametros y si fuese asi
   * el endpoint list requiere limit para determinar la cantidad de items por pagina
   * y dicha propiedad no se encuentra en la interface `TotsQuery`
   * @param limit clients per page
   * @param page
   */
  override list({page, per_page}: TotsQuery): Observable<TotsListResponse<Client>> {
    return this.http.post<TotsApiResponse<TotsListResponse<Client>>>(`${this.basePathUrl}/list`, {
      page,
      limit: per_page
    })
      .pipe(
        map(list => {
          const {data: clients, ...pagination} = list.response
          this._clients.next(clients);
          this._pagination.next(pagination)
          return list.response
        })
      )
  }

  /**
   * Get client by id
   * @param itemId
   * @Override
   */
  override fetchById(itemId: number): Observable<Client> {
    return this.http.get<TotsApiResponse<Client>>(`${this.basePathUrl}/fetch/${itemId}`)
      .pipe(
        map(({response: client}) => client)
      )
  }

  override update(item: Client): Observable<Client> {
    const clients = this._clients.value
    const currentClientIndex: number = clients.findIndex((client: Client) => client.id === item.id)

    return this.http.post<TotsApiResponse<Client>>(`${this.basePathUrl}/save`, item)
      .pipe(
        map(({success,response: client}) => {
          clients[currentClientIndex] = client
          this._clients.next(clients)
          return client
        })
      )
  }

  override create(item: Client): Observable<Client> {
    const pagination = this._pagination.value
    const query = new TotsQuery()
    query.page = 1
    query.per_page = pagination.per_page
    return this.http.post<TotsApiResponse<Client>>(`${this.basePathUrl}/save`, item)
      .pipe(
        switchMap((client) => {
          return this.list(query)
            .pipe(
              map(() => (client.response)),
            )
        })
      )
  }

  override removeById(itemId: number): Observable<{ deletes: Array<number> }> {
    const pagination = this._pagination.value
    const query = new TotsQuery()
    query.page = pagination.current_page
    query.per_page = pagination.per_page

    return this.http.delete<TotsApiResponse<boolean>>(`${this.basePathUrl}/remove/${itemId}`)
      .pipe(
        switchMap((res) => {
          return this.list(query)
            .pipe(
              map(() => ({deletes: [itemId]})),
            )
        })
      )
  }
}
