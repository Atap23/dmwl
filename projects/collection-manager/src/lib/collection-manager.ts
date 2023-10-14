import { CollectionPagination } from './collection-pagination';
import { CollectionFilter } from './collection-filter';
import { BehaviorSubject, combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { CollectionSort } from './collection-sort';
import { CollectionPage, Keys, Sort, ViewModel, ViewModelObservable } from './collection-manager.types';

export abstract class CollectionManager<Data extends object, FilterPayload extends object> {

  public set data(value: Data[]) {
    this._data$.next([...value]);
  }

  public set totalElements(value: number) {
    this._totalElements$.next(value);
  }

  public set isLoadingData(value: boolean) {
    this._isLoadingData$.next(value);
  }

  public set page(page: Partial<CollectionPage> | undefined) {
    this._pagination.setPage(page);
  }

  public set sort(sort: Partial<Sort<Keys<Data>>> | undefined) {
    this._sort.setSort(sort);
  }

  public set filter(filter: Partial<FilterPayload> | undefined) {
    this._filter.setFilter(filter);
  }

  public viewModel$!: Observable<ViewModel<Data, FilterPayload>>;

  protected _filter: CollectionFilter<FilterPayload> = new CollectionFilter<FilterPayload>();
  protected _pagination: CollectionPagination = new CollectionPagination();
  protected _sort: CollectionSort<Keys<Data>> = new CollectionSort<Keys<Data>>();

  protected _data$: BehaviorSubject<Data[]> = new BehaviorSubject<Data[]>([]);
  protected _isLoadingData$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  protected _totalElements$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  protected _instanceDestroyed$: Subject<void> = new Subject<void>();

  constructor() {
    this._buildViewModel();
  }

  protected abstract getApiRequest(): Observable<unknown>

  protected abstract setApiRequest(data: unknown): void

  public requestDataFromApi(): void {
    this.isLoadingData = true;
    this.getApiRequest().pipe(takeUntil(this._instanceDestroyed$)).subscribe((apiData: unknown) => {
      this.setApiRequest(apiData);
      this.isLoadingData = false;
    });
  }

  public destroy(): void {
    this._instanceDestroyed$.next();
    this._instanceDestroyed$.complete();
    this._instanceDestroyed$.unsubscribe();
  }

  private _buildViewModel(): void {
    const observablesMap: ViewModelObservable<Data, FilterPayload> = {
      filter: this._filter.data$,
      sort: this._sort.data$,
      page: this._pagination.page$,
      totalElements: this._totalElements$,
      isLoading: this._isLoadingData$,
      data: this._data$
    }

    this.viewModel$ = combineLatest(observablesMap).pipe(takeUntil(this._instanceDestroyed$));
  }
}
