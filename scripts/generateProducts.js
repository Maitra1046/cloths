import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COLLECTION_DIR = path.join(__dirname, '../Collection');
const OUTPUT_FILE = path.join(__dirname, '../src/data/products.js');

function normalizeFolderName(folderName) {
  return folderName
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function getImageFilesInDir(dir) {
  const files = [];
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(item.name)) {
        files.push(path.join(dir, item.name));
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
  }
  return files.sort();
}

function scanCollectionFolder() {
  const products = [];
  let productCounter = 1;
  
  if (!fs.existsSync(COLLECTION_DIR)) {
    console.error(`Collection directory not found: ${COLLECTION_DIR}`);
    return products;
  }

  const collections = fs.readdirSync(COLLECTION_DIR, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(item => item.name)
    .sort();

  collections.forEach(collectionName => {
    const collectionPath = path.join(COLLECTION_DIR, collectionName);
    const productFolders = fs.readdirSync(collectionPath, { withFileTypes: true })
      .filter(item => item.isDirectory())
      .map(item => ({ name: item.name, path: path.join(collectionPath, item.name) }))
      .sort((a, b) => {
        const numA = parseInt(a.name) || 0;
        const numB = parseInt(b.name) || 0;
        return numA - numB;
      });

    productFolders.forEach(productFolder => {
      const productFolderPath = productFolder.path;
      const variantFolders = fs.readdirSync(productFolderPath, { withFileTypes: true })
        .filter(item => item.isDirectory())
        .map(item => ({ name: item.name, path: path.join(productFolderPath, item.name) }));

      if (variantFolders.length === 0) {
        const images = getImageFilesInDir(productFolderPath)
          .map(imgPath => {
            const relativePath = path.relative(path.join(__dirname, '..'), imgPath);
            return '/' + relativePath.replace(/\\/g, '/');
          });

        if (images.length > 0) {
          const productId = `${collectionName.toLowerCase()}-${productFolder.name}`.replace(/[^a-z0-9-]/g, '-');
          const productName = `${normalizeFolderName(collectionName)} ${productFolder.name}`;
          
          products.push({
            id: productId,
            name: productName,
            title: productName,
            collection: collectionName,
            price: 1234,
            originalPrice: 0,
            description: `Premium ${productName} crafted with attention to detail and premium quality materials.`,
            category: 'Dresses',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Default'],
            materials: ['Silk'],
            care: ['Dry clean only'],
            features: ['Premium quality', 'Handcrafted'],
            isNew: false,
            isBestSeller: false,
            isOnSale: false,
            inStock: true,
            stockCount: 10,
            serialNumber: productCounter++,
            images: images,
            colorVariants: [{
              color: 'Default',
              images: images,
              stockCount: 10,
              inStock: true,
              headAlignment: 20
            }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      } else {
        const variants = [];
        const allColors = [];

        variantFolders.forEach(variantFolder => {
          const variantImages = getImageFilesInDir(variantFolder.path)
            .map(imgPath => {
              const relativePath = path.relative(path.join(__dirname, '..'), imgPath);
              return '/' + relativePath.replace(/\\/g, '/');
            });

          if (variantImages.length > 0) {
            const colorName = normalizeFolderName(variantFolder.name);
            allColors.push(colorName);
            variants.push({
              color: colorName,
              images: variantImages,
              stockCount: 10,
              inStock: true,
              headAlignment: 20
            });
          }
        });

        if (variants.length > 0) {
          const productId = `${collectionName.toLowerCase()}-${productFolder.name}`.replace(/[^a-z0-9-]/g, '-');
          const productName = `${normalizeFolderName(collectionName)} ${productFolder.name}`;
          const defaultImages = variants[0].images;

          products.push({
            id: productId,
            name: productName,
            title: productName,
            collection: collectionName,
            price: 1234,
            originalPrice: 0,
            description: `Premium ${productName} crafted with attention to detail and premium quality materials. Available in multiple color variants.`,
            category: 'Dresses',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: allColors,
            materials: ['Silk'],
            care: ['Dry clean only'],
            features: ['Premium quality', 'Handcrafted'],
            isNew: false,
            isBestSeller: false,
            isOnSale: false,
            inStock: true,
            stockCount: 10,
            serialNumber: productCounter++,
            images: defaultImages,
            colorVariants: variants,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }
    });
  });

  products.sort((a, b) => {
    const collectionCompare = a.collection.localeCompare(b.collection);
    if (collectionCompare !== 0) return collectionCompare;
    const numA = parseInt(a.name.match(/\d+$/)?.[0] || '0');
    const numB = parseInt(b.name.match(/\d+$/)?.[0] || '0');
    return numA - numB;
  });

  products.forEach((product, index) => {
    if (index < 8) {
      product.isBestSeller = true;
      product.isNew = false;
    } else if (index < 15) {
      product.isNew = true;
      product.isBestSeller = false;
    } else {
      product.isNew = false;
      product.isBestSeller = false;
    }
    product.serialNumber = index + 1;
  });

  return products;
}

const products = scanCollectionFolder();

const output = `// Auto-generated products from Collection folder
// Generated at: ${new Date().toISOString()}

export const products = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
console.log(`Generated ${products.length} products in ${OUTPUT_FILE}`);
