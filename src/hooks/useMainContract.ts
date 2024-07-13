import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainCotract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from "ton-core";
import { toNano, fromNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();

  const [balance, setBalance] = useState<null | bigint>(null);

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse("EQCUB96075hnneKIQKYfBvv6pRtvPfuufVoD3XedPGq8fUL5") //EQCUB96075hnneKIQKYfBvv6pRtvPfuufVoD3XedPGq8fUL5
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      const { balance } = await mainContract.getBalance();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
      setBalance(balance);
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toRawString(),
    contract_balance: balance ? fromNano(balance) : 0,
    ...contractData,
    sendIncrement: async () => {
      return mainContract?.sendIncrement(sender, toNano("0.01"), 5);
    },
    sendDeposit: async () => {
      return mainContract?.sendDeposit(sender, toNano("0.01"));
    },
    sendWithdrawalRequest: async () => {
      return mainContract?.sendWithdrawalRequest(
        sender,
        toNano("0.01"),
        toNano("0.02")
      );
    },
  };
}
