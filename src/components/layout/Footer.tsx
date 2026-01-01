import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-cream border-t border-border">
      <div className="container mx-auto container-padding section-padding-y-small">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="font-serif text-xl sm:text-2xl tracking-[0.15em] sm:tracking-[0.2em] text-foreground">
              BEENAS
            </Link>
            <p className="mt-3 sm:mt-4 text-sm text-muted-foreground leading-relaxed">
              Timeless elegance for the modern woman. Handcrafted with care, 
              designed for you.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-serif text-sm tracking-wider uppercase mb-3 sm:mb-4 text-foreground">
              Shop
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  to="/shop?filter=new"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?filter=bestseller"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Best Sellers
                </Link>
              </li>
              {['Dresses', 'Tops', 'Bottoms'].map((item) => (
                <li key={item}>
                  <Link
                    to="/shop"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif text-sm tracking-wider uppercase mb-3 sm:mb-4 text-foreground">
              Customer Care
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {['Size Guide', 'Custom Sizing', 'Shipping', 'Returns', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-serif text-sm tracking-wider uppercase mb-3 sm:mb-4 text-foreground">
              Stay Connected
            </h4>
            <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
              Be the first to know about new collections and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-primary text-primary-foreground text-sm tracking-wider hover:bg-brown/90 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © 2024 BEENAS. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 sm:space-x-6">
            {['Privacy', 'Terms', 'Accessibility'].map((item) => (
              <Link
                key={item}
                to="/"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
