import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import ClientDashboard from "@/pages/ClientDashboard";
import Portfolio from "@/pages/Portfolio";
import MesDossiers from "@/pages/MesDossiers";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/client" element={<ClientDashboard />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/dossiers" element={<MesDossiers />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;