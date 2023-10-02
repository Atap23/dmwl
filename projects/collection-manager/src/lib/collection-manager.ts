import { CollectionPagination } from './collection-pagination';
import { CollectionFilter } from './collection-filter';
import { BehaviorSubject, combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import { CollectionSort } from './collection-sort';
import { Keys, ViewModel } from './collection-manager.types';

export abstract class CollectionManager<Data extends object, FilterPayload extends object> {
  public get data(): Data[] {
    return this._data$.value;
  }

  public set data(value: Data[]) {
    this._data$.next([...value]);
  }

  public get totalElements(): number {
    return this._totalElements$.value;
  }

  public set totalElements(value: number) {
    this._totalElements$.next(value);
  }

  public get isLoadingData(): boolean {
    return this._isLoadingData$.value;
  }

  public set isLoadingData(value: boolean) {
    this._isLoadingData$.next(value);
  }

  public data$: Observable<Data[]> = new Observable<Data[]>();
  public viewModel$!: Observable<ViewModel<Data, FilterPayload>>;
  public isLoadingData$: Observable<boolean> = new Observable<boolean>();

  protected _filter: CollectionFilter<FilterPayload> = new CollectionFilter<FilterPayload>();
  protected _pagination: CollectionPagination = new CollectionPagination();
  protected _sort: CollectionSort<Keys<Data>> = new CollectionSort<Keys<Data>>();

  protected _data$: BehaviorSubject<Data[]> = new BehaviorSubject<Data[]>([]);
  protected _isLoadingData$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  protected _totalElements$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  protected _instanceDestroyed$: Subject<void> = new Subject<void>();

  constructor() {
    this.data$ = this._data$.asObservable();
    this.isLoadingData$ = this._isLoadingData$.asObservable();
    this._buildViewModel();
  }

  protected abstract callToApi(): Observable<unknown>

  protected abstract parseApiData(data: unknown): void

  public getData(): void {
    this.isLoadingData = true;
    this.callToApi().pipe(takeUntil(this._instanceDestroyed$)).subscribe((apiData: unknown) => {
      this.parseApiData(apiData);
      this.isLoadingData = false;
    });
  }

  public destroy(): void {
    this._instanceDestroyed$.next();
    this._instanceDestroyed$.complete();
    this._instanceDestroyed$.unsubscribe();
  }

  private _buildViewModel(): void {
    this.viewModel$ = combineLatest([
      this._filter.data$,
      this._sort.sort$,
      this._pagination.page$,
      this._totalElements$,
      this.isLoadingData$,
      this.data$
    ]).pipe(
      takeUntil(this._instanceDestroyed$),
      map(([filter, sort, page, totalElements, isLoading, data]) => ({
        filter,
        sort,
        page,
        totalElements,
        isLoading,
        data
      }))
    );
  }
}
