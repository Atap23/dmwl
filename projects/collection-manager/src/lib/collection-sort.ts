import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionSortDirection, Sort } from './collection-manager.types';

export class CollectionSort<Keys> {
  public get direction(): CollectionSortDirection {
    return this._data$.value.direction;
  }

  public get field(): Keys | undefined {
    return this._data$.value.field;
  }

  public data$: Observable<Sort<Keys>>;

  private _data$: BehaviorSubject<Sort<Keys>> = new BehaviorSubject<Sort<Keys>>({
    field: undefined,
    direction: 'asc'
  });

  constructor() {
    this.data$ = this._data$.asObservable();
  }

  setSort(sort: Partial<Sort<Keys>> | undefined): void {
    if (!!sort) {
      this._data$.next({
        ...this._data$.value,
        ...sort
      });
    }
  }
}
