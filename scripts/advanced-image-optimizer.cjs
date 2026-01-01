#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

/**
 * Advanced Image Optimization with Multiple Formats and Sizes
 * Creates AVIF, WebP, and optimized JPEG in multiple sizes
 */

const OPTIMIZATION_CONFIG = {
  // Output formats in order of preference
  formats: [
    { ext: 'avif', quality: 50, effort: 9 },  // Best compression
    { ext: 'webp', quality: 75, effort: 6 },  // Good compression
    { ext: 'jpg', quality: 80, progressive: true, mozjpeg: true } // Fallback
  ],
  
  // Responsive sizes
  sizes: [
    { suffix: '-xs', width: 300, quality: 75 },   // Mobile portrait
    { suffix: '-sm', width: 400, quality: 78 },   // Mobile landscape
    { suffix: '-md', width: 600, quality: 80 },   // Tablet
    { suffix: '-lg', width: 800, quality: 82 },   // Desktop
    { suffix: '-xl', width: 1200, quality: 85 },  // Large desktop
    { suffix: '', width: 1600, quality: 85 }      // Original replacement
  ],
  
  // Blur placeholder (tiny base64)
  placeholder: {
    width: 40,
    height: 30,
    quality: 20
  }
};

async function generateBlurPlaceholder(inputPath) {
  try {
    const buffer = await sharp(inputPath)
      .resize(OPTIMIZATION_CONFIG.placeholder.width, OPTIMIZATION_CONFIG.placeholder.height, {
        fit: 'cover'
      })
      .jpeg({ quality: OPTIMIZATION_CONFIG.placeholder.quality })
      .toBuffer();
    
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.warn(`Could not generate placeholder for ${inputPath}`);
    return null;
  }
}

async function optimizeImage(inputPath, outputDir, baseName) {
  const results = {
    original: 0,
    optimized: {},
    placeholders: {}
  };
  
  try {
    // Get original file size
    const originalStats = await fs.stat(inputPath);
    results.original = originalStats.size;
    
    // Generate blur placeholder
    const placeholder = await generateBlurPlaceholder(inputPath);
    if (placeholder) {
      results.placeholders.blur = placeholder;
    }
    
    // Generate all size and format combinations
    for (const size of OPTIMIZATION_CONFIG.sizes) {
      for (const format of OPTIMIZATION_CONFIG.formats) {
        const outputName = `${baseName}${size.suffix}.${format.ext}`;
        const outputPath = path.join(outputDir, outputName);
        
        let pipeline = sharp(inputPath);
        
        // Resize if needed
        if (size.width) {
          pipeline = pipeline.resize(size.width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          });
        }
        
        // Apply format-specific optimization
        if (format.ext === 'avif') {
          pipeline = pipeline.avif({
            quality: format.quality,
            effort: format.effort
          });
        } else if (format.ext === 'webp') {
          pipeline = pipeline.webp({
            quality: format.quality,
            effort: format.effort
          });
        } else if (format.ext === 'jpg') {
          pipeline = pipeline.jpeg({
            quality: format.quality,
            progressive: format.progressive,
            mozjpeg: format.mozjpeg
          });
        }
        
        await pipeline.toFile(outputPath);
        
        // Track file size
        const stats = await fs.stat(outputPath);
        if (!results.optimized[size.suffix]) {
          results.optimized[size.suffix] = {};
        }
        results.optimized[size.suffix][format.ext] = stats.size;
      }
    }
    
    return results;
  } catch (error) {
    console.error(`Failed to optimize ${inputPath}:`, error.message);
    return null;
  }
}

async function processCollectionFolder(collectionPath) {
  console.log(`🔄 Processing ${collectionPath}...`);
  
  const entries = await fs.readdir(collectionPath, { withFileTypes: true });
  let totalOriginal = 0;
  let totalOptimized = 0;
  let processedCount = 0;
  
  for (const entry of entries) {
    const fullPath = path.join(collectionPath, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively process subdirectories
      const subResults = await processCollectionFolder(fullPath);
      totalOriginal += subResults.totalOriginal;
      totalOptimized += subResults.totalOptimized;
      processedCount += subResults.processedCount;
    } else if (entry.name.match(/\.(jpg|jpeg|png)$/i) && !entry.name.includes('-') && !entry.name.includes('.original.')) {
      // Process original images only (not already optimized variants)
      const baseName = path.parse(entry.name).name;
      const results = await optimizeImage(fullPath, collectionPath, baseName);
      
      if (results) {
        totalOriginal += results.original;
        
        // Calculate total optimized size (smallest format for each size)
        for (const sizeKey of Object.keys(results.optimized)) {
          const formats = results.optimized[sizeKey];
          const smallestSize = Math.min(...Object.values(formats));
          totalOptimized += smallestSize;
        }
        
        processedCount++;
        
        // Log progress
        const savings = ((results.original - Object.values(results.optimized[''] || {})[0]) / results.original * 100).toFixed(1);
        console.log(`  ✅ ${entry.name}: ${formatFileSize(results.original)} → Multiple formats (${savings}% base savings)`);
      }
    }
  }
  
  return { totalOriginal, totalOptimized, processedCount };
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

async function generateImageManifest() {
  console.log('📋 Generating image manifest...');
  
  const manifest = {
    generated: new Date().toISOString(),
    collections: {},
    optimization: OPTIMIZATION_CONFIG
  };
  
  const collectionPath = path.join(process.cwd(), 'public', 'Collection');
  const collections = await fs.readdir(collectionPath, { withFileTypes: true });
  
  for (const collection of collections) {
    if (collection.isDirectory()) {
      const collectionDir = path.join(collectionPath, collection.name);
      manifest.collections[collection.name] = await scanCollectionImages(collectionDir);
    }
  }
  
  // Write manifest
  const manifestPath = path.join(process.cwd(), 'public', 'image-manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`✅ Image manifest saved to ${manifestPath}`);
  return manifest;
}

async function scanCollectionImages(dir, basePath = '') {
  const images = {};
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const webPath = basePath ? `${basePath}/${entry.name}` : entry.name;
    
    if (entry.isDirectory()) {
      Object.assign(images, await scanCollectionImages(fullPath, webPath));
    } else if (entry.name.match(/\.(avif|webp|jpg|jpeg)$/i)) {
      const baseName = entry.name.replace(/(-xs|-sm|-md|-lg|-xl)?\.(avif|webp|jpg|jpeg)$/i, '');
      
      if (!images[baseName]) {
        images[baseName] = {
          formats: {},
          sizes: {}
        };
      }
      
      const format = path.extname(entry.name).slice(1).toLowerCase();
      const sizeMatch = entry.name.match(/-(xs|sm|md|lg|xl)\./);
      const size = sizeMatch ? sizeMatch[1] : 'original';
      
      if (!images[baseName].formats[format]) {
        images[baseName].formats[format] = {};
      }
      
      images[baseName].formats[format][size] = `/Collection/${webPath}`;
    }
  }
  
  return images;
}

async function advancedOptimization() {
  console.log('🚀 Starting Advanced Image Optimization...\n');
  
  const collectionPath = path.join(process.cwd(), 'public', 'Collection');
  
  try {
    await fs.access(collectionPath);
  } catch {
    console.error('❌ Collection folder not found at:', collectionPath);
    return;
  }
  
  const startTime = Date.now();
  const results = await processCollectionFolder(collectionPath);
  const endTime = Date.now();
  
  // Generate image manifest for smart loading
  await generateImageManifest();
  
  console.log('\n🎉 Advanced Optimization Complete!');
  console.log('=====================================');
  console.log(`⏱️  Processing time: ${((endTime - startTime) / 1000).toFixed(1)}s`);
  console.log(`📁 Images processed: ${results.processedCount}`);
  console.log(`📦 Original total size: ${formatFileSize(results.totalOriginal)}`);
  console.log(`📦 Optimized total size: ${formatFileSize(results.totalOptimized)}`);
  
  if (results.totalOriginal > 0) {
    const savings = ((results.totalOriginal - results.totalOptimized) / results.totalOriginal * 100).toFixed(1);
    console.log(`💾 Total space saved: ${formatFileSize(results.totalOriginal - results.totalOptimized)} (${savings}%)`);
  }
  
  console.log('\n🎯 What was created:');
  console.log('• AVIF format (50% smaller than JPEG)');
  console.log('• WebP format (25-35% smaller than JPEG)');
  console.log('• Optimized JPEG (fallback)');
  console.log('• 6 responsive sizes per image');
  console.log('• Blur placeholders for instant loading');
  console.log('• Image manifest for smart loading');
}

if (require.main === module) {
  advancedOptimization().catch(console.error);
}

module.exports = { advancedOptimization };