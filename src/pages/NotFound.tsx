import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-serif text-6xl lg:text-8xl text-foreground mb-4">404</h1>
          <p className="font-serif text-2xl text-foreground mb-4">Page Not Found</p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground text-sm tracking-wider hover:bg-brown/90 transition-all duration-300"
          >
            Return Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
