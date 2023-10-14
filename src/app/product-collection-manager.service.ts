import { Observable } from 'rxjs';
import { CollectionManager } from '@dmwl/collection-manager';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Product = {
  id: string;
  label: string;
  price: number;
}

export type ProductFiler = Pick<Product, 'label' | 'price'>

@Injectable({ providedIn: 'root' })
export class ProductCollectionManagerService extends CollectionManager<Product, ProductFiler> implements OnDestroy {

  constructor(private _http: HttpClient) {
    super();
  }

  protected getApiRequest(): Observable<Product[]> {
    return this._http.get<Product[]>('/product');
  }

  protected setApiRequest(data: Product[]): void {
    this.data = data;
    this.totalElements = data.length;
  }

  ngOnDestroy(): void {
    super.destroy();
  }
}
