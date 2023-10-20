import { useState } from "react";
import {
  formRequestUpdateInterface,
  installmentInterface,
} from "../interface/formRequest";
import { api } from "../services/api";
import { notifySucess, notifyError } from "../services/toastfy";
import { initialObject } from "../utils/exampleObject";
import "../style/formUpdate.css";

function FormUpdate({ sale, updateSalesList }: any) {
  const [formData, setFormData] =
    useState<formRequestUpdateInterface>(initialObject);
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

  const cleanData = (data: any) => {
    const cleanedData = { ...data };
    console.log(cleanedData);
    cleanedData.customDueDates = cleanedData.customDueDates.filter(Boolean);
    cleanedData.customInstallmentPrice =
      cleanedData.customInstallmentPrice.filter(Boolean);

    cleanedData.products = cleanedData.products.filter(
      (product: any) => product.name || product.price || product.amount
    );

    if (Object.keys(cleanedData.client).length === 0) {
      cleanedData.client = null;
    }

    return cleanedData;
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const cleanedData = cleanData(formData);

    api
      .patch(`/sales/${sale.id}`, cleanedData)
      .then((response) => {
        notifySucess("Venda atualizada com Sucesso");
        updateSalesList();
      })
      .catch((error) => {
        notifyError(error.response.data.message);
      });
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
      const updatedDueDates: string[] = [...(formData.customDueDates ?? [])];
      updatedDueDates[index] = value;
      setFormData((prevData) => ({
        ...prevData,
        customDueDates: updatedDueDates,
      }));
    } else if (name === "price") {
      const updatedInstallmentPrices: any = [
        ...(formData.customInstallmentPrice ?? []),
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
        defaultValue={sale.client.name}
        onChange={handleClientChange}
        className="clientName"
      />

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
          defaultValue={formData.portion}
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

export default FormUpdate;
