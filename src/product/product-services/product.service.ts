import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private modalStateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  modalState$: Observable<boolean> = this.modalStateSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  setModalState(state: boolean) {
    this.modalStateSubject.next(state);
  }

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>('https://139-162-155-38.ip.linodeusercontent.com:4444/api/v1/products/');
  }

  createProduct(body: any): Observable<any> {
    return this.httpClient.post<any>('https://139-162-155-38.ip.linodeusercontent.com:4444/api/v1/products/', body);
  }

  deleteProduct(id: number): Observable<number> {
    return this.httpClient.delete<any>(`https://139-162-155-38.ip.linodeusercontent.com:4444/api/v1/products/${id}`);
  }

  editProduct(id: number, body: any): Observable<number> {
    return this.httpClient.put<any>(`https://139-162-155-38.ip.linodeusercontent.com:4444/api/v1/products/${id}`, body);
  }
}
