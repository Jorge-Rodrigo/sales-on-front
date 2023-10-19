import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Form from "./components/form";
import List from "./components/list";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [listOn, setListOn] = useState(false);

  return (
    <main>
      <h1>Sales On!</h1>
      <h2>Cadastre suas vendas!</h2>
      {!listOn && (
        <>
          <button className="mainButton" onClick={() => setListOn(true)}>
            Lista de vendas
          </button>
          <Form />
        </>
      )}
      {listOn && (
        <>
          <button className="mainButton" onClick={() => setListOn(false)}>
            Cadastrar Venda
          </button>
          <List />
        </>
      )}
      <ToastContainer />
    </main>
  );
}

export default App;
