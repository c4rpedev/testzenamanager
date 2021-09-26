import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/core/models/product';

@Component({
  selector: 'app-preview-product',
  templateUrl: './preview-product.component.html',
  styleUrls: ['./preview-product.component.scss']
})
export class PreviewProductComponent implements OnInit {
  product: any;
  productTable: Array<any>;
  photosrc: String;
  img: string | ArrayBuffer =
  "https://bulma.io/images/placeholders/480x480.png";
  constructor(public dialogRef: MatDialogRef<PreviewProductComponent>,
    @Inject(MAT_DIALOG_DATA) public products: any) { }

  ngOnInit(): void {
    this.product = this.products['products'];
    this.productTable = this.product.products;
    console.log(this.products['products']);
    console.log(this.product);
  }

}
