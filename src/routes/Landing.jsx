import React, { useState } from "react"
import FormModal from "../components/FormModal"
import Header from "../components/Header"
import Main from "../components/Main"

const Landing = () => {
    const [showForm, setShowForm] = useState(false)

    return (
        <div className="App">
            <Header showForm={showForm} setShowForm={setShowForm} />
            <Main />
            <FormModal open={showForm} onClose={() => setShowForm(false)} />
        </div>
    )
}

export default Landing