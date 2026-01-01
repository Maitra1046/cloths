import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  cartItemCount?: number;
}

export const Layout = ({ children, cartItemCount = 0 }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={cartItemCount} />
      <main className="flex-1 pt-14 sm:pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};
