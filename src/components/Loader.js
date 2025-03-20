// src/components/Loader.js
import { useLoader } from "../context/LoaderContext";
import "./Loader.css"; // Add styles

const Loader = () => {
  const { loading } = useLoader();
  if (!loading) return null;
  return (
    <div className="loader-overlay">
      <div className="loader-spinner"></div>
    </div>
  );
};

export default Loader;
