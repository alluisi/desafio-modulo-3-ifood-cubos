import './App.css';
import Header from './components/Header';
import ButtonFiltros from './components/ButtonFiltros';
import Filtros from './components/Filtros';
import ListaTransacoes from './components/ListaTransacoes';
import Resumo from './components/Resumo';
import ModalRegistro from './components/ModalRegistro';
import { useState } from 'react';

function App() {
  const [modal, setModal] = useState(false);
  const [filtro, setfiltro] = useState(false);
  const [entradaOuSaida, setEntradaOuSaida] = useState('saida');
  const [transactionsData, setTransactionsData] = useState([]);
  const [transactionInEditing, setTransactionInEditing] = useState(false);
  const [loadTransaction, setLoadTransaction] = useState(false);

  async function loadTransactions() {
    try {
      const response = await fetch('http://localhost:3333/transactions', {
        method: 'GET'
      });

      const data = await response.json();

      setTransactionsData(data);
      setLoadTransaction(true);
      setLoadTransaction(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      <Header />
      <div className='container-body'>
        <ButtonFiltros
          filtro={filtro}
          setFiltro={setfiltro}
        />
        <div className='direction-row'>
          <div className='direction-column'>
            {
              filtro && (
                <Filtros
                  transactionsData={transactionsData}
                  setTransactionsData={setTransactionsData}
                  loadTransaction={loadTransaction}
                  loadTransactions={loadTransactions}
                />
              )}
            <ListaTransacoes
              transactionsData={transactionsData}
              setTransactionsData={setTransactionsData}
              loadTransactions={loadTransactions}
              transactionInEditing={transactionInEditing}
              setTransactionInEditing={setTransactionInEditing}
              setModal={setModal}
            />
          </div>
          <Resumo
            setModal={setModal}
            setEntradaOuSaida={setEntradaOuSaida}
            transactionsData={transactionsData}
            loadTransaction={loadTransaction}
          />
        </div>
      </div>
      {
        modal && (
          <ModalRegistro
            setModal={setModal}
            entradaOuSaida={entradaOuSaida}
            setEntradaOuSaida={setEntradaOuSaida}
            loadTransactions={loadTransactions}
            transactionInEditing={transactionInEditing}
            setTransactionInEditing={setTransactionInEditing}
          />)
      }
    </div>
  );
}

export default App;
