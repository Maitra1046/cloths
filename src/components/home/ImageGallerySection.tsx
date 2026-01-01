import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageGalleryCard } from '@/components/product/ImageGalleryCard';
import { FolderOptionsModal } from '@/components/product/FolderOptionsModal';
import { loadAllImageFolders, ImageFolder } from '@/data/imageFolders';
import { textReveal } from '@/lib/animations';

export const ImageGallerySection = () => {
  const [selectedFolder, setSelectedFolder] = useState<ImageFolder | null>(null);
  const [isFolderOptionsOpen, setIsFolderOptionsOpen] = useState(false);
  const folders = loadAllImageFolders();

  const handleOpenFolderOptions = (folder: ImageFolder) => {
    setSelectedFolder(folder);
    setIsFolderOptionsOpen(true);
  };

  const handleCloseFolderOptions = () => {
    setIsFolderOptionsOpen(false);
    setSelectedFolder(null);
  };

  return (
    <section className="py-20 lg:py-28 bg-cream">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          {...textReveal}
          className="text-center mb-12"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-taupe mb-2 block">
            Our Collections
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground">
            Explore Our Gallery
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Click on any collection to view all photos in that collection
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {folders.map((folder, index) => (
            <ImageGalleryCard
              key={folder.id}
              folder={folder}
              index={index}
              onOpenProductOptions={handleOpenFolderOptions}
            />
          ))}
        </div>

        {/* Folder Options Modal */}
        <FolderOptionsModal
          folder={selectedFolder}
          isOpen={isFolderOptionsOpen}
          onClose={handleCloseFolderOptions}
        />
      </div>
    </section>
  );
};

