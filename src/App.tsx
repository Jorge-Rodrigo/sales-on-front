import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Form from "./components/form";
import List from "./components/list";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [listOn, setListOn] = useState(false);

  return (
    <>
      <ToastContainer />
      <h1>Sales On!</h1>
      {!listOn && (
        <>
          <button onClick={() => setListOn(true)}>Lista de vendas</button>
          <Form />
        </>
      )}
      {listOn && (
        <>
          <button onClick={() => setListOn(false)}>Cadastrar Venda</button>
          <List />
        </>
      )}
    </>
  );
}

export default App;
