import { useState } from "react"

function App() {
    const [mesto, setMesto] = useState("")
    const [vreme, setVreme] = useState(null)
    const [loading, setLoading] = useState(false)
    const [napaka, setNapaka] = useState(null)

    const API_KEY = import.meta.env.VITE_API_KEY

    const fetchVreme = async () => {
        if (!mesto) return
        setLoading(true)
        setNapaka(null)
        setVreme(null)

        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${mesto}&appid=${API_KEY}&units=metric&lang=sl`
            )
            if (!res.ok) throw new Error("Mesto ni najdeno")
            const data = await res.json()
            setVreme(data)
        } catch (err) {
            setNapaka(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Vreme</h1>
            <input
                value={mesto}
                onChange={(e) => setMesto(e.target.value)}
                placeholder="Vpiši mesto..."
            />
            <button onClick={fetchVreme}>Išči</button>

            {loading && <p>Nalagam...</p>}
            {napaka && <p>Napaka: {napaka}</p>}
            {vreme && (
                <div>
                    <h2>{vreme.name}</h2>
                    <p>Opis: {vreme.weather[0].description}</p>
                    <p>Temperatura: {vreme.main.temp}°C</p>
                    <p>Vlažnost: {vreme.main.humidity}%</p>
                    <p>Veter: {vreme.wind.speed} m/s</p>
                </div>
            )}
        </div>
    )
}

export default App