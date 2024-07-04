import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProductService } from '../product-services/product.service';
import { Product } from '../product.model';
import { NotificationService } from '../product-services/notification.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  @Input() product: Product | null = null;
  productForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder, 
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.productForm.get('expiration_type')?.valueChanges.subscribe(value => {
      this.updateExpirationDateValidators(value);
    });

    if (this.product) {
        this.loadProductData();
    }else {
        this.addField();
    }
  }

  initForm() {
    this.productForm = this.fb.group({
      id: [],
      name: ['', Validators.required],
      expiration_type: ['non_expirable', Validators.required],
      category: this.fb.group({
        id: [],
        name: []
      }),
      fields: this.fb.array([]),
      manufacture_date: [],
      expiration_date: [],
      comment: []
    });
  }

  get fields() {
    return this.productForm.get('fields') as FormArray;
  }

  createField() {
    return this.fb.group({
      name: ['', Validators.required],
      value: [''],
      is_date: [false]
    });
  }

  addField() {
    this.fields.push(this.createField());
  }

  toggleDatePicker(index: number) {
    const isDate = this.fields.at(index).get('is_date')?.value;
    if (isDate) {
      this.fields.at(index).get('value')?.setValidators([Validators.required]);
    } else {
      this.fields.at(index).get('value')?.clearValidators();
    }
    this.fields.at(index).get('value')?.updateValueAndValidity();
  }

  removeField(index: number) {
    this.fields.removeAt(index);
  }

  loadProductData() {
    this.productForm.patchValue({
      id: this.product?.id,
      name: this.product?.name,
      expiration_type: this.product?.expiration_type,
      category: {
        id: this.product?.category.id,
        name: this.product?.category.name
      },
      manufacture_date: this.product?.manufacture_date,
      expiration_date: this.product?.expiration_date,
      comment: this.product?.comment
    });
  
    while (this.fields.length) {
      this.fields.removeAt(0);
    }
  
    for (const field of this.product?.fields || []) {
      this.fields.push(this.fb.group({
        name: field.name,
        value: field.value,
        is_date: field.is_date
      }));
    }
  }

  updateExpirationDateValidators(expirationType: string) {
    if (expirationType === 'non_expirable') {
      this.productForm.get('expiration_date')?.clearValidators();
    } else {
      this.productForm.get('expiration_date')?.setValidators(Validators.required);
    }
    this.productForm.get('expiration_date')?.updateValueAndValidity();
  }

  onSubmit() {
    const formValue = this.productForm.value;

    const body = {
      id: formValue.id,
      name: formValue.name,
      expiration_type: formValue.expiration_type,
      category_id: formValue.category.id,
      fields: formValue.fields.map((field: any) => ({
        name: field.name,
        value: field.value,
        is_date: field.is_date
      })),
      manufacture_date: formValue.manufacture_date,
      expiration_date: formValue.expiration_date,
      comment: formValue.comment
    };

    if (this.product) {
      this.productService.editProduct(this.product.id, body).subscribe(
        response => {
          this.notificationService.showSuccess('Product updated successfully (Reload page to receive fresh data)');
          this.productService.setModalState(false);
        },
        error => {
          this.notificationService.showError('Error updating product (Check Console)');
          console.error('Error updating product', error);
        }
      );
    } else {
      this.productService.createProduct(body).subscribe(
        response => {
          this.notificationService.showSuccess('Product created successfully (Reload page to receive fresh data)');
          this.productService.setModalState(false);
        },
        error => {
          this.notificationService.showError('Error creating product (Check Console)');
          console.error('Error creating product', error);
        }
      );
    }
  }

  closeModal() {
    this.productService.setModalState(false);
  }
}
