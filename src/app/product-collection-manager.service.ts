import { delay, Observable, of } from 'rxjs';
import { CollectionManager } from 'collection-manager';
import { Injectable } from '@angular/core';

export type Product = {
  id: string;
  label: string;
  price: number;
}

export type ProductFiler = Pick<Product, 'label' | 'price'>

@Injectable({ providedIn: 'root' })
export class ProductCollectionManagerService extends CollectionManager<Product, ProductFiler> {

  protected callToApi(): Observable<Product[]> {
    return of([
      { id: '1', label: 'Product 1', price: 10 },
      { id: '2', label: 'Product 2', price: 20 },
      { id: '3', label: 'Product 3', price: 30 },
      { id: '4', label: 'Product 4', price: 40 },
      { id: '5', label: 'Product 5', price: 50 },
    ]).pipe(delay(2000));
  }

  protected parseApiData(data: Product[]): void {
    this._data$.next(data);
    this.totalElements = data.length;
  }
}
