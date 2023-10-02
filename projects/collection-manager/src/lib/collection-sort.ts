import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionSortDirection, Sort } from './collection-manager.types';

export class CollectionSort<Keys> {
  public get direction(): CollectionSortDirection {
    return this._sort$.value.direction;
  }

  public get field(): Keys | undefined {
    return this._sort$.value.field;
  }

  public sort$: Observable<Sort<Keys>>;

  private _sort$: BehaviorSubject<Sort<Keys>> = new BehaviorSubject<Sort<Keys>>({
    field: undefined,
    direction: 'asc'
  });

  constructor() {
    this.sort$ = this._sort$.asObservable();
  }

  setSort(sort: Partial<Sort<Keys>> | undefined): void {
    if (!!sort) {
      this._sort$.next({
        ...this._sort$.value,
        ...sort
      });
    }
  }
}
