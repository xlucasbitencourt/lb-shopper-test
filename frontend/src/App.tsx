import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import './toast.css';
import Rides from "./pages/Rides";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rides" element={<Rides />} />
      </Routes>
    </>
  );
}

export default App;
