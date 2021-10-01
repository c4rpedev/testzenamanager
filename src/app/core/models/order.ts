import { Product } from "./product";

export class Order {
    orderId: string;
    orderAgency: string;
    orderClientName: string;
    orderClientEmail: string;
    orderClientPhone: string;
    orderAgencyId: string;
    orderPaid: boolean;
    orderFirstLastName: string;
    orderSecondLastName: string;
    orderRecieverName: string;
    orderProvince: string;
    orderMunicipio: string;
    orderAddress: string;
    orderReference: string;
    orderPhone: string;
    orderMobile: string;
    orderSucursal: string;
    orderNote: string;
    orderPrice: number;
    orderAlbaran: File;
    orderDays: number;
    orderCancelMotive: string;
    productArray: Product[];
    state: string;
    createdAt: Date;
    orderInvoice: File;
  }

