import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect"
import React, { useEffect, useState } from "react"

const availableExtensions = [];
let hashConnect = new HashConnect(true)

const INITIAL_SAVE_DATA= {
  topic: "",
  pairingString: "",
  privateKey: "",
  pairedAccounts: [],
  pairedWalletData: null,
};

let APP_CONFIG = {
  name: "VidSocial",
  description: "VidSocial is amazing",
  icon: "https://absolute.url/to/icon.png",
};

const loadLocalData = () => {
  let foundData = localStorage.getItem("hashconnectData");

  if (foundData) {
    const saveData = JSON.parse(foundData);
    // setSaveData(saveData);
    return saveData;
  } else return null;
};

export const HashConnectAPIContext =
  React.createContext({
    connect: () => null,
    walletData: INITIAL_SAVE_DATA,
    netWork: "testnet",
    installedExtensions: null,
    hashConnect
  });

export default function HashConnectProvider({
  children,
  metaData,
  netWork,
  debug,
}) {
  //Saving Wallet Details in Ustate
  const [saveData, SetSaveData] = useState(INITIAL_SAVE_DATA);
  const [installedExtensions, setInstalledExtensions] =
    useState(true);

  //? Initialize the package in mount
  const initializeHashConnect = async () => {
    const saveData = INITIAL_SAVE_DATA;
    const localData = loadLocalData();
    try {
      if (!localData) {
        if (debug) console.log("===Local data not found.=====");

        //first init and store the private for later
        let initData = await hashConnect.init(APP_CONFIG);
        saveData.privateKey = initData.privKey;

        //then connect, storing the new topic for later
        const state = await hashConnect.connect();
        saveData.topic = state.topic;

        //generate a pairing string, which you can display and generate a QR code from
        saveData.pairingString = hashConnect.generatePairingString(
          state,
          "testnet",
          debug
        );

        //find any supported local wallets
        hashConnect.findLocalWallets();
      } else {
        if (debug) console.log("====Local data found====", localData);
        //use loaded data for initialization + connection
        hashConnect.init(metaData ?? APP_CONFIG, localData?.privateKey);
        hashConnect.connect(
          localData?.topic,
          localData?.pairedWalletData ?? metaData
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (localData) {
        SetSaveData((prevData) => ({ ...prevData, ...localData }));
      } else {
        SetSaveData((prevData) => ({ ...prevData, ...saveData }));
      }
      if (debug) console.log("====Wallet details updated to state====");
    }
  };

  const saveDataInLocalStorage = (data) => {
    if (debug)
      console.info("===============Saving to localstorage::=============");
    const { metadata, ...restData } = data;
    SetSaveData((prevSaveData) => {
      prevSaveData.pairedWalletData = metadata;
      return { ...prevSaveData, ...restData };
    });
    let dataToSave = JSON.stringify(data);
    localStorage.setItem("hashconnectData", dataToSave);
  };

  const additionalAccountResponseEventHandler = (
    data
  ) => {
    if (debug) console.debug("=====additionalAccountResponseEvent======", data);
    // Do a thing
  };

  const foundExtensionEventHandler = (
    data
  ) => {
    if (debug) console.debug("====foundExtensionEvent====", data);
    // Do a thing
    setInstalledExtensions(data);
  };

  const pairingEventHandler = (data) => {
    if (debug) console.log("====pairingEvent:::Wallet connected=====", data);
    // Save Data to localStorage
    saveDataInLocalStorage(data);
  };

  useEffect(() => {
    //Intialize the setup
    initializeHashConnect();

    // Attach event handlers
    hashConnect.foundExtensionEvent.once(data => {
        if (debug) console.debug("====foundExtensionEvent====", data);
        setInstalledExtensions(data);
    });
    hashConnect.pairingEvent.on(pairingEventHandler);

    return () => {
      // Detach existing handlers
      hashConnect.foundExtensionEvent.off(foundExtensionEventHandler);
      hashConnect.pairingEvent.off(pairingEventHandler);
    };
  }, []);

  const connect = () => {
    if (installedExtensions) {
      if (debug) console.log("Pairing String::", saveData.pairingString);
      hashConnect.connectToLocalWallet(saveData?.pairingString);
    } else {
      if (debug) console.log("====No Extension is not in browser====");
      return "wallet not installed";
    }
  };

  return (
    <HashConnectAPIContext.Provider
      value={{ connect, walletData: saveData, netWork, installedExtensions }}
    >
      {children}
    </HashConnectAPIContext.Provider>
  );
}

const defaultProps = {
  metaData: APP_CONFIG,
  netWork: "testnet",
  debug: false,
};

HashConnectProvider.defaultProps = defaultProps;

export function useHashConnect() {
  const value = React.useContext(HashConnectAPIContext);
  return value;
}

export function getHashConnect() {
  return hashConnect
}