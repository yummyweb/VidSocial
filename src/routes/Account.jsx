import React, { useEffect, useState } from "react"
import Card from "../components/Card"
import Header from "../components/Header"
import FormModal from "../components/FormModal"
import { getAllVideos } from "../utils/video"
import { useHashConnect } from "../hooks/HashConnectAPIProvider";

const Account = () => {
  const [showForm, setShowForm] = useState(false)
  const [videos, setVideos] = useState(null)
  const { walletData } = useHashConnect();
  const { accountIds } = walletData;

  useEffect(() => {
    (async () => {setVideos(await getAllVideos())})()
  }, [])

  return (
    <div className="min-w-screen">
      <Header setShowForm={setShowForm} />
      <div className="w-full py-32 grid grid-cols-3 mx-auto container flex justify-between gap-12">
        {accountIds && videos ? videos.map(video => (
          <Card key={video.id} id={video.id} title={video.title} issue={video.issue} author={video.author} hash={video.hash} timestamp={video.timestamp} likes={video.likes} />
        )) : "Loading"}
      </div>
      <FormModal open={showForm} onClose={() => setShowForm(false)} />
    </div>
  )
}

export default Account