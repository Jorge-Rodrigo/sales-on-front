import { useState, useEffect } from "react";
import { api } from "../services/api";
import "../style/list.style.css";
import FormUpdate from "./formUpdate";

function List() {
  const [sales, setSales] = useState([]) as any;
  const [salePayment, setSalePayment] = useState() as any;
  const [loading, setLoading] = useState(true);
  const [selectedSaleId, setSelectedSaleId] = useState(null) as any;
  const [selectedSale, setSelectedSale] = useState(null) as any;

  useEffect(() => {
    api
      .get("/sales")
      .then((response) => {
        setSales(response.data);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar a lista de vendas:", error);
        setLoading(false);
      });
  }, []);

  const deleteSale = async (id: number) => {
    try {
      await api.delete(`/sales/${id}`);

      const response = await api.get("/sales");
      setSales(response.data);
    } catch (error) {
      console.error("Erro ao excluir a venda:", error);
    }
  };
  const getPaymentDetail = async (id: number) => {
    api
      .get(`/sales/${id}/payment-plan`)
      .then((response) => {
        setSalePayment(response.data);
        console.log(response.data);
        setSelectedSaleId(id);
      })
      .catch((error) => {
        console.error("Erro ao buscar a lista de vendas:", error);
      });
  };

  const closePaymentDetail = () => {
    setSalePayment(null);
  };

  const updateSalesList = async () => {
    try {
      const response = await api.get("/sales");
      setSales(response.data);
    } catch (error) {
      console.error("Erro ao atualizar a lista de vendas:", error);
    }
  };

  function formatDate(dateString: any) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Note que o mês é base 0, então adicionamos 1.
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return (
    <div className="listMain">
      <h2>Lista de Vendas</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {sales.map((sale: any) => (
            <li key={sale.id}>
              <div className="saleInfo">
                <div className="clientInfo">
                  {!sale.client.name && <h4>Cliente não cadastrado</h4>}
                  {sale.client.name && <h4>{sale.client.name}</h4>}
                  <h4 className="price">R${sale.totalPrice}</h4>
                </div>
                <p className="paymenteMethod">
                  Método de pagamento: <span>{sale.paymentMethod}</span>
                </p>
                <p className="portion">
                  Quantidade de Parcelas: <span>{sale.portion}</span>
                </p>
                <button
                  className="portionDetail"
                  onClick={() => getPaymentDetail(Number(sale.id))}
                >
                  Ver Detalhes do Parcelamento
                </button>
                {salePayment && selectedSaleId == sale.id && (
                  <div key={salePayment.id} className="paymentePortionDetail">
                    <h2>R${salePayment.totalPrice}</h2>
                    <p>Parcelas: {salePayment.portions}</p>
                    <ul>
                      {salePayment.allPortions &&
                        salePayment.allPortions.map((portion: any) => (
                          <li>
                            <p>
                              Preço: <span>R$ {portion.price}</span>
                            </p>
                            <p>
                              Data: <span>{formatDate(portion.date)}</span>
                            </p>
                          </li>
                        ))}
                      <button
                        className="closePaymentDetailButton"
                        onClick={() => closePaymentDetail()}
                      >
                        Fechar
                      </button>
                    </ul>
                  </div>
                )}
              </div>

              <h3>Produtos:</h3>
              {sale.products.map((prod: any) => (
                <div className="productInfo">
                  <h4>{prod.name} - </h4>
                  <p className="productPrice">R$ {prod.price} - </p>
                  <p>Quant: {prod.amount}</p>
                </div>
              ))}
              <div className="buttonsDiv">
                <button onClick={() => setSelectedSale(sale)}>
                  Editar venda
                </button>
                <button
                  className="deleteButton"
                  onClick={() => deleteSale(Number(sale.id))}
                >
                  Excluir venda
                </button>
              </div>
              {selectedSale && selectedSale.id == sale.id && (
                <>
                  <FormUpdate
                    sale={selectedSale}
                    updateSalesList={updateSalesList}
                  />
                  <button onClick={() => setSelectedSale(null)}>Fechar</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default List;
