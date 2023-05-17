import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ImportPSTS from "./pages/ImportPSTS";
import Match from "./pages/Match";
import FiltersVideo from "./components/filters/FiltersVideo";
import FiltersAnalysis from "./pages/FiltersAnalysis";
import StatsPage from "./pages/StatsPage";

function App() {
  return (
    <>
      <Router>
        <div className="flex flex-col h-screen">
          <Navbar />
          <main className="container mx-2 px-3 pb-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/import-psts" element={<ImportPSTS />} />
              <Route path="/match" element={<Match />} />
              <Route path="/statspage" element={<StatsPage />} />
              <Route path="/filters" element={<FiltersAnalysis />} />
              <Route path="/filtersvideo" element={<FiltersVideo />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
