import { Component } from '@angular/core';
import { ProductCollectionManagerService } from './product-collection-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'api-table-utilities-demo';

  constructor(public productCollectionManager: ProductCollectionManagerService) {
    console.log('START!!!');
    this.productCollectionManager.getData();

    this.productCollectionManager.viewModel$.subscribe((vm) => {
      console.log(vm);
    });
  }
}
