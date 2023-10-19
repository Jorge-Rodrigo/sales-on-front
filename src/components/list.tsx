import { useState, useEffect } from "react";
import { api } from "../services/api";
import "../style/list.style.css";

function List() {
  const [sales, setSales] = useState([]) as any;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/sales")
      .then((response) => {
        setSales(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar a lista de vendas:", error);
        setLoading(false);
      });
  }, []);

  const deleteSale = async (id: number) => {
    try {
      api.delete(`/sales/${id}`);
      const response = await api.get("/sales");
      setSales(response.data);
    } catch (error) {
      console.error("Erro ao excluir a venda:", error);
    }
  };
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
                <button className="portionDetail">
                  Ver Detalhes do Parcelamento
                </button>
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
                <button>Editar venda</button>
                <button
                  className="deleteButton"
                  onClick={() => deleteSale(Number(sale.id))}
                >
                  Excluir venda
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default List;
