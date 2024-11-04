import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "antd";
import { OKXUniversalConnectUI, THEME } from "@okxconnect/ui";

import "./App.css";

function App() {
  const universalUi = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [signResult, setSignResult] = useState("");
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

    localStorage.clear();

  };

  useEffect(() => {
    //  const scriptTag =  document.createElement("script");
    //   scriptTag.src = "https://telegram.org/js/telegram-web-app.js";
    //   scriptTag.id = "tgsdk";
    //   document.getElementsByTagName('head')[0].appendChild(scriptTag);
    initFunc();
  }, []);

  const handleConnect = async () => {
    if (isConnected) {
      return;
    }
    const session = await universalUi?.current?.openModal({
      namespaces: {
        eip155: {
          chains: ["eip155:1"],
          rpcMap: {
            1: "https://rpc.flashbots.net", // set your own rpc url
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

  const [text, text2] = useMemo(() => {
    if (!universalUi?.current?.session) {
      return [`Connect Wallet`, "no wallet"];
    }
    return [
      "Conected",
      `wallet address is ${universalUi?.current?.session?.namespaces?.eip155?.accounts?.[0]}`,
    ];
  }, [universalUi?.current?.session]);

  const handlePersonalSign = async () => {
    const chain = "eip155:43114";
    const data = {
      method: "personal_sign",
      params: [
        "0x506c65617365207369676e2074686973206d65737361676520746f20636f6e6669726d20796f7572206964656e746974792e",
      ],
    };
    const personalSignResult = await universalUi.current?.request(
      data,
      chain,
      "all"
    );
    setSignResult(personalSignResult);
    console.log(personalSignResult, "personalSignResult");
  };

  return (
    <>
      <h1 className="title">Dapp Demo</h1>
      <p className='text'>{text2}</p>
      <Button type="primary" onClick={handleConnect} disabled={isConnected}>
        {text}
      </Button>
      <br />
      <br />
      <Button onClick={handlePersonalSign}>personal sign</Button>
      <br />
      <h3>Sign Result</h3>
      <p className='text'>{signResult}</p>
    </>
  );
}

export default App;
