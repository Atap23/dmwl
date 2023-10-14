import { CollectionManager } from '../collection-manager';
import { combineLatest, takeUntil } from 'rxjs';


export abstract class CommonCollectionManager<Data extends object, FilterPayload extends object> extends CollectionManager<Data, FilterPayload> {

  constructor() {
    super();

    this._setUpHooks();
  }

  private _setUpHooks(): void {
    combineLatest([this._filter.data$, this._sort.data$, this._pagination.page$]).pipe(
      takeUntil(this._instanceDestroyed$)
    ).subscribe(() => {
      this.requestDataFromApi();
    });
  }
}
