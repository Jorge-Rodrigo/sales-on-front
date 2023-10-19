import { useState } from "react";

import "./App.css";
import Form from "./components/form";
import List from "./components/list";

function App() {
  const [listOn, setListOn] = useState(false);

  return (
    <>
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
