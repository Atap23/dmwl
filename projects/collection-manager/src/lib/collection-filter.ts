import { BehaviorSubject, Observable } from 'rxjs';
import { Keys, Values } from './collection-manager.types';

export class CollectionFilter<F extends object> {
  public data$: Observable<F>;

  private _data: Map<Keys<F>, Values<F>> = new Map<Keys<F>, Values<F>>();
  private _data$: BehaviorSubject<F> = new BehaviorSubject<F>({} as F);

  constructor() {
    this.data$ = this._data$.asObservable();
  }

  public setFilter(object: Partial<F> | undefined): void {
    if (!!object && !!Object.keys(object).length) {
      for (const [filterKey, filterValue] of Object.entries(object)) {
        if (!!filterKey && !!filterValue) {
          this._data.set(filterKey as Keys<F>, filterValue as Values<F>);
        }
      }
    }
  }

  public getFilter<T extends Keys<F>>(key: T): F[T] {
    return this._data.get(key) as F[T];
  }
}
