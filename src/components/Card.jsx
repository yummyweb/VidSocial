import React, { useState } from 'react'
import { formatDistance } from "date-fns"
import { FcLikePlaceholder } from "react-icons/fc"
import { AiOutlineDownload } from "react-icons/ai"
import { likeVideo } from '../utils/video'
import { useHashConnect } from "../hooks/HashConnectAPIProvider";
import { mintToken } from '../utils/token'
import { NFTStorage } from 'nft.storage'
import Popup from "./Popup"

const Card = ({ id, title, issue, author, hash, timestamp, likes }) => {
  const [_likes, _setLikes] = useState(likes)
  const [showPopup, setShowPopup] = useState(false)
  const { walletData } = useHashConnect();
  const { accountIds } = walletData;

  const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJCNWJGQ2FBZTdhNUU3MGFEMjk0MzkwN2JlMjNmMzM1QzJBNjQwQ2YiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MDczNTU3NTk3MSwibmFtZSI6InZpZHNvY2lhbCJ9.KxKY9wXaKfzLJXl_OawX6qJEp_n6cyIDsI3onl3Hc6M'
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

  const getVideoBlob = async () => {
    const res = await fetch(`https://ipfs.infura.io/ipfs/${hash}`)
    return await res.blob()
  }

  const mint = async (name, _id, video) => {
    const metadata = await client.store({
      name: title,
      description: 'This is the NFT for a VidSocial video of id #' + id + '.',
      image: await getVideoBlob()
    })
    const res = await mintToken(metadata.ipnft)
    setShowPopup(true)
  }

  return (
    <div class="block">
      <div class="px-4 py-2 flex justify-between">
        <p class="mt-2 text-gray-500">
          By 0.0.{ author.num.low }
        </p>
        <p class="mt-2 text-gray-500">
          { formatDistance(new Date(parseInt(timestamp) * 1000), new Date(), { addSuffix: true }) }
        </p>
      </div>

      <video
        class="object-cover w-full h-56 shadow-xl rounded-xl"
        src={`https://ipfs.infura.io/ipfs/${hash}`}
        alt=""
        controls
      ></video>

      <div class="p-4">
        <h5 class="text-xl font-bold text-gray-900">
          { title }
        </h5>
        <div class="flex justify-between">
          <p class="mt-2 text-gray-500">
            #{ issue }
          </p>
          <div class="flex items-center">
            {_likes >= 5 && `0.0.${author.num.low}` === accountIds[0] ? (
              <div class="px-2">
                <AiOutlineDownload onClick={() => mint()} size={22} />
              </div>
            ) : null}
            <p class="text-gray-500 px-2">{ _likes }</p>
            <FcLikePlaceholder size={22} onClick={() => {
              likeVideo(id)
              _setLikes(prev => parseInt(prev) + 1)
            }} />
          </div>
        </div>
      </div>
      {showPopup && <Popup content="NFT minted successfully!" onClose={() => setShowPopup(false)} />}
    </div>
  )
}

export default Card