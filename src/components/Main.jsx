import React from "react"
import { useNavigate } from "react-router-dom"
import "./Main.css"

const Main = () => {
    const navigate = useNavigate()

    return (
        <div class="relative w-full overflow-hidden">
            <div class="min-h-screen flex bg-gradient-to-b from-white to-green-50">
                <div class="container m-auto px-6 py-20 md:pb-0 md:pt-40 md:px-12 lg:py-0 lg:px-10">
                    <div class="flex flex-wrap gap-12">
                        <div class="lg:w-6/12 lg:pt-32 lg:pb-20">
                            <div class="space-y-8 mt-8 lg:-mr-24 xl:-mr-0">
                                <h1 class="text-4xl text-gray-800 font-bold md:text-5xl lg:leading-tight">Meet the Truth</h1>
                                <p class="text-lg text-gray-600">Boosting social and political discussions through NFT incentives for an evergrowing world.</p>

                                <div class="flex space-x-4">
                                    <button onClick={() => navigate("/feed")} type="button" title="Go to feed" class="w-full py-3 px-6 rounded-xl text-center transition bg-green-600 hover:bg-green-700 active:bg-green-800 focus:bg-green-500 sm:w-max">
                                        <span class="block text-white font-semibold">
                                            Go to Feed
                                        </span>
                                    </button>
                                    <button type="button" title="Start buying" class="w-full py-3 px-6 rounded-xl text-center transition active:bg-green-200 focus:bg-green-100 sm:w-max">
                                        <div class="flex">
                                            <span class="block text-green-700 font-semibold">
                                                Our showreel
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div class="mt-8 pt-8 border-t border-gray-300">
                                <h6 class="text-lg text-green-800 font-semibold">Built with</h6>
                                <div class="mt-6 flex gap-6">
                                    <div class="flex items-center">
                                        <img class="-hue-rotate-30" width="80px" src="https://docs.ipfs.io/images/ipfs-logo.svg" alt="IPFS Logo" />
                                    </div>
                                    <div class="flex items-center">
                                        <img class="-hue-rotate-30" width="200px" src="https://pedrorijo.com/assets/img/react-logo.png" alt="" />
                                    </div>

                                    <div class="flex items-center">
                                        <img class="-hue-rotate-30" width="120px" src="/solidity.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div class="hidden bottom-0 md:-right-32 md:block md:w-full md:ml-auto lg:absolute lg:-right-32 lg:w-[60%] xl:-right-48">
                            <img src="https://tailus.io/sources/blocks/horse/preview/images/horse1.png" class="ml-48 lg:ml-0" alt="gril on an horse" loading="lazy" width="1053" height="772" />
                        </div> */}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Main