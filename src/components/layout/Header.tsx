import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getSearchSuggestions } from '@/utils/search';

const navLinks = [
  { name: 'New Arrivals', href: '/shop?filter=new' },
  { name: 'Best Sellers', href: '/shop?filter=bestseller' },
  { name: 'Collections', href: '/collections' },
  { name: 'Shop All', href: '/shop' },
];

interface HeaderProps {
  cartItemCount?: number;
}

export const Header = ({ cartItemCount: propCartCount }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItemCount: contextCartCount } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const cartItemCount = contextCartCount || propCartCount || 0;

  // Update search suggestions when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const suggestions = getSearchSuggestions(searchQuery);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    navigate(`/shop?search=${encodeURIComponent(suggestion)}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <nav className="container mx-auto container-padding">
        <div className="grid grid-cols-3 items-center h-14 sm:h-16 lg:h-20">
          {/* Left Section - Mobile Menu + Desktop Nav */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-foreground hover:text-primary active:text-primary transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Desktop Navigation - Left */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-xs sm:text-sm tracking-wide link-underline transition-colors whitespace-nowrap",
                    location.pathname + location.search === link.href
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Center Section - Logo */}
          <div className="flex justify-center">
            <Link
              to="/"
              className="font-serif text-lg sm:text-xl lg:text-2xl xl:text-3xl tracking-[0.1em] sm:tracking-[0.15em] lg:tracking-[0.2em] text-foreground hover:text-primary transition-colors"
            >
              BEENAS
            </Link>
          </div>

          {/* Right Section - Desktop Nav + Icons */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 lg:gap-6">
            {/* Desktop Navigation - Right */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navLinks.slice(2).map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-xs sm:text-sm tracking-wide link-underline transition-colors whitespace-nowrap",
                    location.pathname + location.search === link.href
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-4 bg-border" />

            {/* Icons */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  "p-2.5 sm:p-2.5 rounded-full transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center",
                  isSearchOpen 
                    ? "bg-secondary text-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 active:bg-secondary/50"
                )}
                aria-label="Search"
              >
                <Search size={18} className="sm:w-[18px] sm:h-[18px]" />
              </button>

              {/* Account/Login */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="p-2.5 sm:p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 active:bg-secondary/50 transition-colors hidden sm:flex touch-manipulation min-h-[44px] min-w-[44px] items-center justify-center">
                    <User size={18} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-sm shadow-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="p-1">
                      <Link
                        to="/account"
                        className="block px-3 py-2 text-sm hover:bg-secondary rounded-sm"
                      >
                        My Account
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-3 py-2 text-sm hover:bg-secondary rounded-sm"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-secondary rounded-sm"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2.5 sm:p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 active:bg-secondary/50 transition-colors hidden sm:flex touch-manipulation min-h-[44px] min-w-[44px] items-center justify-center"
                  aria-label="Login"
                >
                  <User size={18} className="sm:w-[18px] sm:h-[18px]" />
                </Link>
              )}

              {!isAdmin && (
                <Link
                  to="/cart"
                  className="p-2.5 sm:p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 active:bg-secondary/50 transition-colors relative touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Cart"
                >
                  <ShoppingBag size={18} className="sm:w-[18px] sm:h-[18px]" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 sm:top-0.5 sm:right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-primary text-primary-foreground text-[9px] sm:text-[10px] font-medium rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border overflow-hidden bg-background"
            >
              <form onSubmit={handleSearch} className="py-4 flex items-center gap-3">
                <button 
                  type="submit"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Search"
                >
                  <Search size={16} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search for dresses, tops, silk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                    autoFocus
                  />
                  
                  {/* Search Suggestions */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border shadow-lg rounded-sm z-50">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    setShowSuggestions(false);
                  }}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <X size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="container container-padding py-4 sm:py-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-lg text-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4 border-t border-border space-y-3"
              >
                {isAuthenticated ? (
                  <>
                    <div className="text-sm text-muted-foreground">
                      Signed in as {user?.name}
                      {isAdmin && <span className="ml-2 text-primary">(Admin)</span>}
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-lg text-foreground hover:text-primary transition-colors"
                    >
                      My Account
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-lg text-foreground hover:text-primary transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block text-lg text-foreground hover:text-primary transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-lg text-foreground hover:text-primary transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-lg text-foreground hover:text-primary transition-colors"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
