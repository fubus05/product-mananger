import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductListComponent } from '../product/product-list/product-list.component';
import { ProductModule } from '../product/product.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductModule],
  template: `
    <app-product-list></app-product-list>
  `,
})
export class AppComponent {
  title = 'test-app';
}