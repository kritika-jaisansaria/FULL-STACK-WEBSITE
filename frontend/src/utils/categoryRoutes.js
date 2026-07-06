// Maps navbar route slugs -> the actual `category` value stored on products
// (must match the <option value="..."> values in Components/admin/ManageProducts.jsx)
export const CATEGORY_SLUG_MAP = {
  solitaire: { type: 'category', value: 'solitaire', label: 'Solitaire' },
  rings: { type: 'category', value: 'rings', label: 'Rings' },
  pendants: { type: 'category', value: 'pendant', label: 'Pendants' },
  bracelets: { type: 'category', value: 'bracelet', label: 'Bracelets' },
  'mangalsutra-bracelets': { type: 'category', value: 'mangalsutra_bracelet', label: 'Mangalsutra Bracelets' },
  nosepin: { type: 'category', value: 'nosepin', label: 'Nosepin' },
  'watch-pin': { type: 'category', value: 'watchpin', label: 'Watch Pin' },
  chain: { type: 'category', value: 'chain', label: 'Chain' },
  'rakhi-pendants': { type: 'category', value: 'rakhi_pendant', label: 'Rakhi Pendants' },
  earrings: { type: 'category', value: 'earrings', label: 'Earrings' },
  bangles: { type: 'category', value: 'bangles', label: 'Bangles' },
  mangalsutra: { type: 'category', value: 'mangalsutra', label: 'Mangalsutra' },
  necklace: { type: 'category', value: 'necklace', label: 'Necklace' },
  'watch-charm': { type: 'category', value: 'watch_charm', label: 'Watch Charm' },
  souvenir: { type: 'category', value: 'souvenir', label: 'Souvenir' },

  // By gender (navbar slug -> value stored in generalDetails.gender)
  male: { type: 'gender', value: 'men', label: 'Jewellery for Him' },
  female: { type: 'gender', value: 'women', label: 'Jewellery for Her' },
  kids: { type: 'gender', value: 'kids', label: 'Kids Jewellery' },

  // By occasion (navbar top-level shortcuts)
  'daily-wear': { type: 'occasion', value: 'daily_wear', label: 'Daily Wear' },
  wedding: { type: 'occasion', value: 'wedding', label: 'Wedding Collection' },

  // By material (navbar top-level shortcuts)
  gold: { type: 'material', value: 'gold', label: 'Gold Jewellery' },
  diamond: { type: 'material', value: 'diamond', label: 'Diamond Jewellery' },
};

// Every navbar link path that should render the category listing page
export const CATEGORY_ROUTE_PATHS = Object.keys(CATEGORY_SLUG_MAP).map((slug) => `/${slug}`);