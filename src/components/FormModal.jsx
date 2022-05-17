import React, { Fragment, useState } from "react"
import { Dialog, Transition } from '@headlessui/react'
import { createVideo } from "../utils/video"
import Popup from "./Popup"

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

const FormModal = ({ open, onClose }) => {
    const [video, setVideo] = useState(null)
    const [title, setTitle] = useState(null)
    const [issue, setIssue] = useState(null)
    const [showPopup, setShowPopup] = useState({ show: false, content: "Video created successfully!" })

    const captureFile = e => {
        const file = e.target.files[0]
        window.URL = window.URL || window.webkitURL
        const videoEl = document.createElement('video')
        videoEl.preload = 'metadata'
        videoEl.onloadedmetadata = function () {
            window.URL.revokeObjectURL(videoEl.src)
        }
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)

        reader.onloadend = () => {
            setVideo(Buffer(reader.result))
        }
    }

    const uploadVideo = async () => {
        if (video && title && issue) {
            try {
                const result = await ipfs.add(video)
                const status = await createVideo(result.path, title, issue)
                setShowPopup({ show: true, content: "Video created successfully!" })
            }
            catch (e) {
                console.log(e)
                setShowPopup({
                    show: true,
                    content: "File is too big!"
                })
            }
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            className="fixed z-10 inset-0 overflow-y-auto"
        >
            <div className="flex items-center justify-center min-h-screen">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                    >
                        Upload a new video
                    </Dialog.Title>
                    <div className="mt-5">
                        <input value={title} onChange={e => setTitle(e.target.value)} type="text" name="title" id="title" class="appearance-none focus:ring-1 mb-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Title" />
                        <input value={issue} onChange={e => setIssue(e.target.value)} type="text" name="issue" id="issue" class="appearance-none focus:ring-1 mb-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Issue" />
                        <input onChange={e => captureFile(e)} accept=".mp4, .ogg, .mkv, .wmv" id="upload" type="file" />
                    </div>

                    <div className="mt-5">
                        <button
                            type="button"
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                            onClick={() => uploadVideo()}
                        >
                            Upload
                        </button>
                        <button
                            type="button"
                            className="ml-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            {showPopup.show && <Popup content={showPopup.content} onClose={() => setShowPopup({ show: false })} />}
        </Dialog>
    )
}

export default FormModal