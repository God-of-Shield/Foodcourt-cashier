import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, UtensilsCrossed } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="card-glow p-12 text-center max-w-md animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-primary/20 mx-auto mb-6 flex items-center justify-center">
          <UtensilsCrossed className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Halaman tidak ditemukan
        </p>

        <Link 
          to="/login" 
          className="btn-glow inline-flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Kembali ke Login
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
