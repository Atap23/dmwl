import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionPage } from './collection-manager.types';

export class CollectionPagination {
  public get currentPage(): number {
    return this._page$.value.page;
  }

  public set currentPage(value: number) {
    this._page$.next({
      page: value,
      pageSize: this._page$.value.pageSize
    });
  }

  public get pageSize(): number {
    return this._page$.value.pageSize;
  }

  public set pageSize(value: number) {
    this._page$.next({
      page: value === this._page$.value.pageSize ? this._page$.value.page : 0,
      pageSize: value
    })
  }

  public page$: Observable<CollectionPage>;

  private _page$: BehaviorSubject<CollectionPage> = new BehaviorSubject<CollectionPage>({
    page: 1,
    pageSize: 10
  });

  constructor() {
    this.page$ = this._page$.asObservable();
  }

  public setPage(pageData: Partial<CollectionPage> | undefined): void {
    if (!!pageData) {
      this._page$.next({
        ...this._page$.value,
        ...pageData
      })
    }
  }
}
