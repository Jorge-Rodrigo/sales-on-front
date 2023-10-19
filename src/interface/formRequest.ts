export interface formRequestInterface {
  client: {
    name: string;
  };
  products: {
    name: string;
    price: string;
    amount: string;
  }[];
  paymentMethod: string;
  portion: number;
  customDueDates: string[];
  customInstallmentPrice: string[];
}

export interface installmentInterface {
  date: string;
  price: string;
}
