import { useState, useEffect } from "react";
import { api } from "../services/api";

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
    <div>
      <h1>Lista de Vendas</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {sales.map((sale: any) => (
            <li key={sale.id}>
              <h2>Cliente: {sale.client.name}</h2>
              <p>Preço total: {sale.totalPrice}</p>
              <p>metodo de pagamento: {sale.paymentMethod}</p>
              <p>{sale.portion} parcelas</p>
              <h3>Produtos:</h3>
              {sale.products.map((prod: any) => (
                <div>
                  <h4>{prod.name}</h4>
                  <p>R$ {prod.price}</p>
                  <p>Quantidade: {prod.amount}</p>
                </div>
              ))}
              <button onClick={() => deleteSale(Number(sale.id))}>
                Excluir venda
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default List;
