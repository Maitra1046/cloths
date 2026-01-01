export interface ImageFolder {
  id: string;
  name: string;
  images: string[];
  price: number;
}

// Load all images from the 6 folders
export const loadAllImageFolders = (): ImageFolder[] => {
  const folders: ImageFolder[] = [];
  
  // Folder 1
  folders.push({
    id: '1',
    name: 'Collection 1',
    price: 245,
    images: [
      '/images/1/472636132_18494340229055333_8508015192970385025_n.jpg',
      '/images/1/476413274_18493129849055333_6393025584599470363_n.jpg',
      '/images/1/479911851_18493308325055333_2038909686913535390_n.jpg',
    ],
  });

  // Folder 2
  folders.push({
    id: '2',
    name: 'Collection 2',
    price: 385,
    images: [
      '/images/2/480582541_18494489026055333_4430316595967347907_n.jpg',
      '/images/2/480949301_18494488498055333_4663220101625422947_n.jpg',
    ],
  });

  // Folder 3
  folders.push({
    id: '3',
    name: 'Collection 3',
    price: 695,
    images: [
      '/images/3/476890490_18492917497055333_930122029282978216_n.jpg',
      '/images/3/477512650_18492805741055333_7359610091230207216_n.jpg',
    ],
  });

  // Folder 4
  folders.push({
    id: '4',
    name: 'Collection 4',
    price: 425,
    images: [
      '/images/4/475050421_18490125451055333_1062884586514090543_n.jpg',
      '/images/4/475227428_18489953854055333_2978779640798761751_n.jpg',
      '/images/4/475448481_18490117453055333_8221004949663647852_n.jpg',
    ],
  });

  // Folder 5
  folders.push({
    id: '5',
    name: 'Collection 5',
    price: 285,
    images: [
      '/images/5/427274231_710628584604391_2260818846021514853_n.jpg',
      '/images/5/427299055_1154542805953560_6860923222235937002_n.jpg',
      '/images/5/427453485_945241387169748_4530459283650464450_n.jpg',
    ],
  });

  // Folder 6
  folders.push({
    id: '6',
    name: 'Collection 6',
    price: 345,
    images: [
      '/images/6/426232219_383894351006299_6840845240984982857_n.jpg',
      '/images/6/426375133_694259706227206_2872162030514006950_n.jpg',
      '/images/6/427124599_1415363119069064_1839395826783394724_n.jpg',
    ],
  });

  return folders;
};

