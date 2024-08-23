import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";
import WebApp from "@twa-dev/sdk";

function App() {
  const {
    contract_address,
    counter_value,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawalRequest,
  } = useMainContract();

  const { connected } = useTonConnect();
  const showAlert = () => {
    WebApp.showAlert("Hey there!!");
  };

  return (
    <>
      <div className="App">
        <TonConnectButton />
      </div>
      <div>
        <div className="Card">
          <b>{WebApp.platform}</b>
          <br />
          <b>Our contract address</b>
          <div className="Hint">{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          {contract_balance && <div className="Hint">{contract_balance}</div>}
        </div>
        <div className="Card">
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>

        <a
          onClick={() => {
            showAlert();
          }}
        >
          Have a fun, bro!
        </a>
        <br />
        {connected && (
          <a
            onClick={() => {
              sendIncrement();
            }}
          >
            Increment by 5
          </a>
        )}
        <br />
        {connected && (
          <a
            onClick={() => {
              sendDeposit();
            }}
          >
            Deposit by 0.01
          </a>
        )}
        <br />
        {connected && (
          <a
            onClick={() => {
              sendWithdrawalRequest();
            }}
          >
            Request 0.02 TON withdrawal
          </a>
        )}
      </div>
    </>
  );
}

export default App;
