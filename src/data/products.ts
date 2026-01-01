// Using brand photos from local `photos` folder
// Mapped roughly to product types for a cohesive look
import product1 from '../../photos/11875568_807510156028295_68306196_n.jpg';
import product2 from '../../photos/260623063_909590773279418_1615113370293305298_n.jpg';
import product3 from '../../photos/420039665_1675939996516828_5342388678473611498_n.jpg';
import product4 from '../../photos/420147818_1474157560108988_2637396117499757950_n.jpg';
import product5 from '../../photos/427124599_1415363119069064_1839395826783394724_n.jpg';
import product6 from '../../photos/475448481_18490117453055333_8221004949663647852_n.jpg';
import product7 from '../../photos/545076921_18533348368055333_8546273287939047266_n.jpg';
// Reuse some images where needed
const product8 = product2;

// Legacy interface for backward compatibility
export interface LegacyProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  fabric: string;
  images: string[];
  colors: string[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  description: string;
  careInstructions: string;
  deliveryEstimate: string;
}

export const products: LegacyProduct[] = [
  {
    id: '1',
    name: 'Silk Ivory Blouse',
    price: 245,
    category: 'Tops',
    fabric: 'Silk',
    images: [product1, product2, product7],
    colors: ['Ivory', 'Cream', 'Rose'],
    isBestSeller: true,
    description: 'A timeless silk blouse crafted from the finest mulberry silk. Features a relaxed silhouette with mother-of-pearl buttons and French seams throughout.',
    careInstructions: 'Dry clean only. Store on padded hanger.',
    deliveryEstimate: '5-7 business days',
  },
  {
    id: '2',
    name: 'Linen Midi Dress',
    price: 385,
    category: 'Dresses',
    fabric: 'Linen',
    images: [product2, product6, product1],
    colors: ['Ivory', 'Cream'],
    isBestSeller: true,
    description: 'Effortlessly elegant midi dress in premium European linen. The flowing silhouette flatters every figure with its empire waist and adjustable shoulder ties.',
    careInstructions: 'Machine wash cold, tumble dry low. Iron while damp.',
    deliveryEstimate: '5-7 business days',
  },
  {
    id: '3',
    name: 'Wool Tailored Coat',
    price: 695,
    category: 'Outerwear',
    fabric: 'Wool',
    images: [product3, product1, product4],
    colors: ['Camel', 'Brown'],
    isBestSeller: true,
    description: 'A refined tailored coat in double-faced Italian wool. Classic notched lapels and horn buttons create a sophisticated silhouette perfect for the transitional season.',
    careInstructions: 'Professional dry clean only.',
    deliveryEstimate: '7-10 business days',
  },
  {
    id: '4',
    name: 'Cashmere Rose Sweater',
    price: 425,
    category: 'Knitwear',
    fabric: 'Cashmere',
    images: [product4, product1, product7],
    colors: ['Rose', 'Ivory', 'Cream'],
    isNewArrival: true,
    description: 'Luxuriously soft cashmere sweater in a delicate rose hue. Raglan sleeves and ribbed trims create a relaxed yet refined everyday essential.',
    careInstructions: 'Hand wash cold with cashmere shampoo. Lay flat to dry.',
    deliveryEstimate: '5-7 business days',
  },
  {
    id: '5',
    name: 'Wide-Leg Linen Trousers',
    price: 285,
    category: 'Bottoms',
    fabric: 'Linen',
    images: [product5, product2, product6],
    colors: ['Ivory', 'Cream', 'Camel'],
    isBestSeller: true,
    description: 'Flowing wide-leg trousers in crisp Italian linen. High-rise waist with pleated front for a flattering drape. Features hidden side pockets.',
    careInstructions: 'Machine wash cold, hang dry. Steam to remove wrinkles.',
    deliveryEstimate: '5-7 business days',
  },
  {
    id: '6',
    name: 'Silk Slip Dress',
    price: 345,
    category: 'Dresses',
    fabric: 'Silk',
    images: [product6, product2, product1],
    colors: ['Cream', 'Camel', 'Ivory'],
    isNewArrival: true,
    description: 'An elegant silk slip dress with cowl neckline and bias cut for the most flattering drape. Delicate spaghetti straps with adjustable length.',
    careInstructions: 'Dry clean only. Store in breathable garment bag.',
    deliveryEstimate: '5-7 business days',
  },
  {
    id: '7',
    name: 'Embroidered Cotton Blouse',
    price: 195,
    category: 'Tops',
    fabric: 'Cotton',
    images: [product7, product1, product4],
    colors: ['Ivory', 'Cream'],
    description: 'Artisan-crafted cotton blouse with delicate hand embroidery. Features balloon sleeves and a relaxed fit that pairs beautifully with tailored pieces.',
    careInstructions: 'Machine wash cold inside out. Iron on reverse.',
    deliveryEstimate: '5-7 business days',
  },
  {
    id: '8',
    name: 'Linen Maxi Skirt',
    price: 265,
    category: 'Bottoms',
    fabric: 'Linen',
    images: [product8, product5, product2],
    colors: ['Camel', 'Brown', 'Cream'],
    isNewArrival: true,
    description: 'A sweeping maxi skirt in rich terracotta linen. Elasticated waist with smocked detail provides comfort without compromising on elegance.',
    careInstructions: 'Machine wash cold, tumble dry low.',
    deliveryEstimate: '5-7 business days',
  },
];

export const categories = ['All', 'Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Knitwear'];
export const fabrics = ['All', 'Silk', 'Linen', 'Cotton', 'Wool', 'Cashmere'];
export const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $250', min: 0, max: 250 },
  { label: '$250 - $400', min: 250, max: 400 },
  { label: 'Over $400', min: 400, max: Infinity },
];
