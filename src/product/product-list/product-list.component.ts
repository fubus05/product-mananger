import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from '../product-services/product.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  isModalOpen: boolean = false;
  private modalStateSubscription!: Subscription;
  selectedProduct: Product | null = null;

  constructor(public productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();

    this.modalStateSubscription = this.productService.modalState$.subscribe((state: boolean) => {
      this.isModalOpen = state;
    });
  }

  ngOnDestroy() {
    if (this.modalStateSubscription) {
      this.modalStateSubscription.unsubscribe();
    }
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
  }

  openModal(product?: Product) {
    console.log(product)
    if (product) {
      this.selectedProduct = product;
    } else {
      this.selectedProduct = null;
    }
    this.productService.setModalState(true);
  }

  closeModal() {
    this.productService.setModalState(false);
  }

  deleteItem(id: number) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }
}
