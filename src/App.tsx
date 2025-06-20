import "@picocss/pico/css/pico.css";
import "./styles/App.css";
import NavBar from "./components/NavBar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <NavBar />
      <AppRoutes />
    </>
  );
}

export default App;
