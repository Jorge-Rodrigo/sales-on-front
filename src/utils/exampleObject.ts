import { formRequestInterface } from "../interface/formRequest";

const initialObject: formRequestInterface = {
  client: {
    name: "",
  },
  products: [
    {
      name: "",
      price: "",
      amount: "",
    },
  ],
  paymentMethod: "À Vista",
  portion: 1,
  customDueDates: [],
  customInstallmentPrice: [],
};

export { initialObject };
