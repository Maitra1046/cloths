import { ProductService } from '@/services/productService';
import { loadAllImageFolders, ImageFolder } from '@/data/imageFolders';
import { Product } from '@/types/product';

export interface SearchResult {
  folders: ImageFolder[];
  products: Product[];
  totalResults: number;
}

export const performSearch = (query: string): SearchResult => {
  if (!query.trim()) {
    const allFolders = loadAllImageFolders();
    const allProducts = ProductService.getAllProducts();
    return {
      folders: allFolders,
      products: allProducts,
      totalResults: allFolders.length
    };
  }

  const searchQuery = query.toLowerCase().trim();
  
  // Search products using ProductService
  const matchingProducts = ProductService.searchProducts(searchQuery);
  
  // Search folders by name and description
  const allFolders = loadAllImageFolders();
  const matchingFolders = allFolders.filter(folder => {
    const folderName = folder.name.toLowerCase(); // Changed from folderName to name
    
    // Direct name match
    if (folderName.includes(searchQuery)) {
      return true;
    }
    
    // Category-based matching
    const categoryMatches = [
      { terms: ['dress', 'dresses'], categories: ['dress', 'gown', 'frock'] },
      { terms: ['silk'], categories: ['silk', 'satin', 'luxury'] },
      { terms: ['cotton'], categories: ['cotton', 'casual', 'comfort'] },
      { terms: ['top', 'tops', 'blouse'], categories: ['top', 'blouse', 'shirt'] },
      { terms: ['ethnic', 'traditional'], categories: ['saree', 'kurta', 'ethnic', 'traditional'] },
      { terms: ['formal', 'office'], categories: ['formal', 'office', 'professional'] },
      { terms: ['casual', 'everyday'], categories: ['casual', 'daily', 'comfort'] },
      { terms: ['party', 'evening'], categories: ['party', 'evening', 'cocktail'] },
      { terms: ['summer'], categories: ['summer', 'light', 'breathable'] },
      { terms: ['winter'], categories: ['winter', 'warm', 'heavy'] }
    ];

    for (const match of categoryMatches) {
      if (match.terms.some(term => searchQuery.includes(term))) {
        if (match.categories.some(category => 
          folderName.includes(category)
        )) {
          return true;
        }
      }
    }

    return false;
  });

  return {
    folders: matchingFolders,
    products: matchingProducts,
    totalResults: matchingFolders.length
  };
};

export const getSearchSuggestions = (query: string): string[] => {
  const suggestions = [
    'dresses',
    'silk dresses',
    'cotton tops',
    'ethnic wear',
    'formal wear',
    'casual wear',
    'blouses',
    'sarees',
    'kurtas',
    'party wear',
    'office wear',
    'summer collection',
    'winter collection',
    'traditional',
    'modern',
    'designer',
    'handcrafted'
  ];

  if (!query.trim()) return suggestions.slice(0, 6);

  const searchQuery = query.toLowerCase();
  const filtered = suggestions
    .filter(suggestion => suggestion.includes(searchQuery))
    .slice(0, 6);

  // If no matches found, return some popular suggestions
  if (filtered.length === 0) {
    return suggestions.slice(0, 4);
  }

  return filtered;
};