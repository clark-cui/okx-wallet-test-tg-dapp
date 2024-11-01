import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "antd";
import { OKXUniversalConnectUI, THEME } from "@okxconnect/ui";

import "./App.css";

function App() {
  const universalUi = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const initFunc = async () => {
    universalUi.current = await OKXUniversalConnectUI.init({
      dappMetaData: {
        icon: "https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png",
        name: "OKX WalletConnect UI Demo",
      },
      actionsConfiguration: {
        returnStrategy: "tg://resolve",
        modals: "all",
        tmaReturnUrl: "back",
      },
      language: "en_US",
      uiPreferences: {
        theme: THEME.LIGHT,
      },
    });
  };

  useEffect(() => {
    initFunc();
  }, []);

  const handleConnect = async () => {
    if (isConnected) {
      return;
    }
    const session = await universalUi?.current?.openModal({
      namespaces: {
        eip155: {
          chains: ["eip155:1", "eip155:xxx"],
          rpcMap: {
            1: "https://rpc", // set your own rpc url
          },
          defaultChain: "1",
        },
      },
      optionalNamespaces: {
        eip155: {
          chains: ["eip155:43114"],
        },
      },
    });
    setIsConnected(true);
    console.log(session, "connected");
  };

  const text = useMemo(() => {
    if (!universalUi?.current?.session) {
      return `Connect Wallet`;
    }
    return "Conected";
  }, [universalUi?.current?.session]);

  return (
    <>
      <h1 className="title">Dapp Demo</h1>
      <Button type="primary" onClick={handleConnect}>
        {text}
      </Button>
    </>
  );
}

export default App;
