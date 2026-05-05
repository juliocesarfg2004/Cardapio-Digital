import { BrowserRouter, Route, Routes } from "react-router-dom"
import { App } from "../app"
import { Checkout } from "../pages/Checkout"

export function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  )
}