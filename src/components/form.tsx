import { useState } from "react";
import { api } from "../services/api";
import { initialObject } from "../utils/exampleObject";
import {
  formRequestInterface,
  installmentInterface,
} from "../interface/formRequest";
import { notifyError, notifySucess } from "../services/toastfy";
import "../style/form.style.css";

function Form() {
  const [formData, setFormData] = useState<formRequestInterface>(initialObject);
  const [installments, setInstallments] = useState<installmentInterface[]>([]);

  const handleClientChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      client: {
        ...prevData.client,
        [name]: value,
      },
    }));
  };

  const handleProductChange = (index: number, e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      products: prevData.products.map((product, i) =>
        i === index ? { ...product, [name]: value } : product
      ),
    }));
  };

  const addProduct = () => {
    setFormData((prevData) => ({
      ...prevData,
      products: [...prevData.products, { name: "", price: "", amount: "" }],
    }));
  };

  const handlePaymentMethodChange = (e: any) => {
    const { name, value } = e.target;
    let portion = formData.portion;

    if (value === "Parcelado") {
      portion = 1;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      portion,
    }));
  };

  const handlePortionChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const data = {
      client: formData.client,
      products: formData.products.map((product) => ({
        name: product.name,
        price: parseFloat(product.price),
        amount: parseInt(product.amount),
      })),
      paymentMethod: formData.paymentMethod,
      portion: Number(formData.portion),
      customDueDates: formData.customDueDates,
      customInstallmentPrice: formData.customInstallmentPrice.map((price) =>
        parseFloat(price)
      ),
    };

    api
      .post("/sales", data)
      .then((response) => {
        notifySucess("Venda cadastrada com Sucesso");
      })
      .catch((error) => {
        notifyError(error.response.data.message);
      });
    console.log(data);
  };

  const addInstallment = () => {
    setInstallments([...installments, { date: "", price: "" }]);

    setFormData((prevData: any) => ({
      ...prevData,
      customDueDates: [...prevData.customDueDates, ""],
      customInstallmentPrice: [...prevData.customInstallmentPrice, ""],
    }));
  };

  const handleInstallmentChange = (index: number, e: any) => {
    const { name, value } = e.target;
    const updatedInstallments = [...installments];
    updatedInstallments[index] = {
      ...updatedInstallments[index],
      [name]: value,
    };
    setInstallments(updatedInstallments);

    if (name === "date") {
      const updatedDueDates: any = [...formData.customDueDates];
      updatedDueDates[index] = value;
      setFormData((prevData) => ({
        ...prevData,
        customDueDates: updatedDueDates,
      }));
    } else if (name === "price") {
      const updatedInstallmentPrices: any = [
        ...formData.customInstallmentPrice,
      ];
      updatedInstallmentPrices[index] = value;
      setFormData((prevData) => ({
        ...prevData,
        customInstallmentPrice: updatedInstallmentPrices,
      }));
    }
  };
  return (
    <form className="formSale" onSubmit={handleSubmit}>
      <label className="clientNameLabel">Nome do Cliente: </label>
      <input
        type="text"
        name="name"
        defaultValue={formData.client.name}
        onChange={handleClientChange}
        className="clientName"
      />
      <div className="productButton">
        <h2>Produtos</h2>
        <button type="button" onClick={addProduct}>
          Adicionar Produto
        </button>
      </div>
      <div className="productsMainForm">
        {formData.products.map((product, index) => (
          <div key={index} className="productForm">
            <label>Nome do Produto:</label>
            <input
              type="text"
              name={`name`}
              defaultValue={product.name}
              onChange={(e) => handleProductChange(index, e)}
              required
            />
            <label>Preço:</label>
            <input
              type="number"
              name={`price`}
              defaultValue={product.price}
              onChange={(e) => handleProductChange(index, e)}
              required
            />
            <label>Quantidade:</label>
            <input
              type="number"
              name={`amount`}
              defaultValue={product.amount}
              onChange={(e) => handleProductChange(index, e)}
              required
            />
          </div>
        ))}
      </div>
      <div className="paymentForm">
        <label>Método de Pagamento: </label>
        <select
          name="paymentMethod"
          defaultValue={formData.paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          <option value="À Vista">À Vista</option>
          <option value="Parcelado">Parcelado</option>
        </select>
      </div>
      <div className="portionForm">
        <label>Número de Parcelas: </label>
        <input
          type="number"
          name="portion"
          defaultValue={formData.portion | 1}
          onChange={handlePortionChange}
        />
      </div>
      {formData.paymentMethod === "Parcelado" && (
        <div className="portionButton">
          <h2>Parcelas</h2>
          <button type="button" onClick={addInstallment}>
            Adicionar Parcela
          </button>
        </div>
      )}
      <div className="portionDetailForm">
        {installments.map((installment: installmentInterface, index: any) => (
          <div key={index}>
            <label>Data:</label>
            <input
              type="date"
              name={`date`}
              defaultValue={installment.date}
              onChange={(e) => handleInstallmentChange(index, e)}
              required
              className="dateInput"
            />
            <label>Preço:</label>
            <input
              type="number"
              name={`price`}
              defaultValue={installment.price}
              onChange={(e) => handleInstallmentChange(index, e)}
              required
              className="priceInput"
            />
          </div>
        ))}
      </div>
      <button type="submit" className="submitFormButton">
        Enviar
      </button>
    </form>
  );
}

export default Form;
