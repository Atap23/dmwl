import { Observable } from 'rxjs';

export type Keys<T> = keyof T;
export type Values<T> = T[Keys<T>];
export type CollectionSortDirection = 'asc' | 'desc';

export type CollectionPage = {
  page: number;
  pageSize: number;
}

export type Sort<Keys> = {
  direction: CollectionSortDirection;
  field: Keys | undefined
}

export type ViewModel<Data extends object, FilterPayload extends object> = {
  data: Data[];
  filter: Partial<FilterPayload>;
  sort: Sort<Keys<Data>>;
  page: CollectionPage;
  totalElements: number;
  isLoading: boolean;
}

export type ViewModelObservable<Data extends object, FilterPayload extends object> = {
  [K in keyof ViewModel<Data, FilterPayload>]: Observable<ViewModel<Data, FilterPayload>[K]>
}
