# CollectionManager

El objetivo de esta librería es ahorrar trabajo a la hora de gestionar una tabla de datos.

## Como funciona

La clase **abstracta** `CollectionManager` es la que contiene la gran mayoría de lógica necesaria para
gestionar una tabla a través del backend.

La idea es extender dicha clase, implementando los métodos `getApiRequest` y `setApiRequest`. También hay que implementar la interfaz
de Angular `onDestroy`, para invocar `super.destroy()` en el método `ngOnDestroy`. Esto es necesario para poder parar las suscripciones
que se hacen dentro de la clase `CollectionManager`.

- El método `getApiRequest` es el que invoca la clase `CollectionManager` cuando necesita hacer la llamada al backend. Este método 
debe devolver un observable. Normalmente en este método se usará `this._http.get()` para obtener dicho observable, aunque 
también lo puedes manejar datos estáticos devolviendo `of(dataArray)` por ejemplo.

- El método `setApiRequest` es el que invoca la clase `CollectionManager` para actuar una vez el backend a respondido correctamente.
Aquí normalmente actualizarás como mínimo el array de datos con `this.data = dataArray`, y probablemente el total de elementos con
`this.totalElements = dataArray.length` por ejemplo.

Hay que destacar que la propiedad `isLoadingData` se pone a `true` justo antes de la llamada al método `getApiRequest` y se pone a `false`
justo después de la llamada al método `setApiRequest`.

## Ejemplo de implementación de `CollectionManager`

```typescript
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
```
