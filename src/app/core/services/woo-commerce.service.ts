import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WooCommerceService {

  readonly URL = 'https://labolsa.biz/wp-json/wc/v3/';

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get(this.URL + 'products', {
      headers: {
        'Authorization': 'Basic Y2tfNDNhZjVhN2Y4ODUxZWNjNTFjODA5ZTY1YTYzZmVmZjMyZmFkMTBmNTpjc18wN2U4NDI1NDUxZTNlNTA5ZGVjMzgyZWY1NDI3YWU0ZTY5Y2FhZTEx'
      }
    });
  }

  getOrders() {
    return this.http.get(this.URL + 'orders', {
      headers: {
        'Authorization': 'Basic Y2tfNDNhZjVhN2Y4ODUxZWNjNTFjODA5ZTY1YTYzZmVmZjMyZmFkMTBmNTpjc18wN2U4NDI1NDUxZTNlNTA5ZGVjMzgyZWY1NDI3YWU0ZTY5Y2FhZTEx'
      }
    });
  }

  getUsersss() {
    return this.http.get(this.URL);
  }
}
