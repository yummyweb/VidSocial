import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useHashConnect } from "../hooks/HashConnectAPIProvider";
import FormModal from "./FormModal";
import Popup from "./Popup";

const Header = ({ setShowForm }) => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false)
    const { connect, walletData, installedExtensions } = useHashConnect();
    const { accountIds, netWork, id } = walletData;

    const conCatAccounts = (lastAccs, Acc) => {
        return lastAccs + " " + Acc;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(walletData.pairingString);
        setShowPopup(true)
    };

    const loginOrLogout = () => {
        if (!accountIds) {
            connect()
            handleCopy()
        }
    }

    return (
        <header>
            <nav class="absolute w-full">
                <div class="relative z-10 bg-white">
                    <div class="container m-auto md:px-12 lg:py-0 lg:px-10">
                        <div class="flex flex-wrap items-center justify-between py-4 gap-6 md:gap-0">
                            <div class="w-full px-6 flex justify-between md:w-max md:px-0">
                                <a href="#" aria-label="logo">
                                    <img src="/logo1.png" class="w-36" alt="tailus logo" width="144" height="68" />
                                </a>

                                <button aria-label="humburger" id="hamburger" class="relative w-10 h-10 -mr-2 md:hidden">
                                    <div aria-hidden="true" id="line" class="inset-0 w-6 h-0.5 m-auto rounded bg-gray-500 transtion duration-300"></div>
                                    <div aria-hidden="true" id="line2" class="inset-0 w-6 h-0.5 mt-2 m-auto rounded bg-gray-500 transtion duration-300"></div>
                                </button>
                            </div>
                            <div class="hidden w-full flex-wrap justify-end items-center space-y-4 p-6 rounded-xl bg-white md:flex md:w-8/12 md:space-y-0 md:space-x-4 md:divide-x md:p-0 md:flex-nowrap md:bg-transparent lg:w-7/12">
                                <div class="w-full space-y-4 md:w-max md:space-y-0 md:space-x-4 md:flex">
                                    <button onClick={() => setShowForm(true)} type="button" title="Go to your feed" class="w-full py-3 px-6 rounded-xl text-center transition active:bg-green-200 focus:bg-green-100 sm:w-max">
                                        <span class="block text-green-600 font-semibold">
                                            + Upload
                                        </span>
                                    </button>
                                    <button onClick={loginOrLogout} type="button" title="Start buying" class="w-full py-3 px-6 rounded-xl text-center transition bg-green-600 hover:bg-green-700 active:bg-green-800 focus:bg-green-500 sm:w-max">
                                        <span class="block text-white font-semibold">
                                            {accountIds ? "Logout" : "Login"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div aria-hidden="true" class="w-11/12 h-4 -mt-6 m-auto bg-green-600 blur md:-mt-4 opacity-30"></div>
                {showPopup && <Popup onClose={() => setShowPopup(false)} content="Pairstring copied to clipboard!" />}
            </nav>
        </header>
    )
}

export default Header