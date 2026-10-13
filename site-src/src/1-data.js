/* ---------- Config: edit these when the business confirms details ---------- */
const CONFIG = {
  brand: "Chami's House of Food",
  slogan: 'Great Food. Great Experience.',
  // Numbers exactly as printed on the contact graphic.
  whatsapp: { display: '080/800900', intl: '23280800900' },
  call: { display: '074198888', intl: '23274198888' },
  // Currency was not printed on the menu, so prices show as plain numbers.
  currencyPrefix: '',
};

const CATEGORIES = [
  { id: 'beef', label: 'Beef Burgers', short: 'Beef', tile: 'tileBurger' },
  { id: 'chicken', label: 'Chicken Burgers', short: 'Chicken', tile: 'tileChicken' },
  { id: 'appetizers', label: 'Appetizers', short: 'Appetizers', tile: 'tileFries' },
  { id: 'sides', label: 'Sides', short: 'Sides', tile: 'fries' },
  { id: 'drinks', label: 'Drinks', short: 'Drinks', tile: 'tileDrinks' },
];

/* Image pools: stand-ins until Chami's has a photo of every item. */
const IMG_POOL = {
  beef: ['hero', 'menuBurger', 'smash', 'aboutburger'],
  chicken: ['menuChicken', 'tileChicken'],
  appetizers: ['tileFries', 'menuChicken', 'fries'],
  sides: ['tileFries', 'fries'],
  drinks: ['tileDrinks'],
};

const slug = (s) => s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* Beef burgers: names and prices from the supplied brief (not on the menu photo). */
const BEEF = [
  ['Wahala Burger', 210], ['Double Decker', 210], ['Swiss Mushroom', 220], ['Mozzarella Beef Burger', 220],
  ['Smash Burger', 170], ['Big Daddy', 210], ['Padi Man', 220], ['Triple C', 230], ['Danger', 230],
  ['Monster Burger', 220], ['Top G', 200], ['Mac Burger Beef', 220], ['Truffle Burger', 200],
  ['Lebanese Burger', 170], ['Bacon Beef Burger', 220], ['Cuban Burger', 220],
];

/* Chicken burgers: from the menu photo, descriptions as printed there. */
const CHICKEN = [
  ["Chami's", 200, 'Fried chicken dipped in buffalo, mozzarella patty, Thousand Island sauce, crunchy chips'],
  ['Grilled Mozzarella Burger', 200, 'Juicy grilled chicken, mozzarella patty, garlic mayo, tomato, pickles'],
  ['Bang Burger', 180, 'Fried chicken, mozzarella patty, dynamite sauce, jalapenos'],
  ['Prime Burger', 200, 'Fried chicken, mozzarella patty, turkey slice, pickles, ranch sauce, BBQ sauce'],
  ['King C', 190, 'Fried chicken, onion rings, cheddar cheese, ranch sauce, pickles'],
  ['Double Decker', 220, 'Double fried chicken, BBQ, honey mustard, ranch, cheddar sauce, mozzarella patty', 'double-decker-chicken'],
  ['Hot Bite', 210, 'Double grilled chicken, double cheese, BBQ sauce, jalapenos, buffalo sauce'],
  ['Boss Man', 210, '2 chicken breast, coleslaw, Thousand Island sauce, mix cheeses, chips'],
  ['Escalope Burger', 190, 'Escalope chicken breast, cheddar cheese, garlic mayo, coleslaw, pickles, French fries, cocktail sauce'],
  ['Flamingo', 180, 'Chicken breast, cheddar cheese, mix bell pepper and onions, mozzarella, garlic mayo'],
  ['Nashville Burger', 190, 'Fried chicken, cheddar cheese, garlic mayo, coleslaw, pickles, French fries, cocktail sauce'],
  ['Beast Burger', 220, ''],
  ['BBQ Burger', 200, ''],
  ['Zinger', 200, ''],
  ['Buffalo Burger', 220, ''],
  ['Fish Burger', 220, ''],
];

const ITEMS = [
  ...BEEF.map(([name, price], i) => ({
    id: slug(name), name, price, cat: 'beef', desc: '', tags: ['burger', 'beef'], idx: i,
  })),
  ...CHICKEN.map(([name, price, desc, id], i) => ({
    id: id || slug(name), name, price, cat: 'chicken', desc, tags: ['burger', 'chicken'], idx: i,
  })),
  { id: 'double-trouble', name: 'Double Trouble', price: 220, cat: 'appetizers', desc: 'Fried chicken, French fries, cheddar sauce, ranch, smoked BBQ', tags: ['chicken', 'fries'] },
  { id: 'big-boss', name: 'Big Boss', price: 220, cat: 'appetizers', desc: 'Chicken tenders, French fries, mozzarella cheese, buffalo sauce, ranch, jalapenos', tags: ['chicken', 'fries', 'tenders'] },
  {
    id: 'tenders', name: 'Tenders', price: 190, cat: 'appetizers', desc: 'Choose BBQ, buffalo or honey mustard', tags: ['chicken', 'tenders'],
    variants: [{ label: '5 pieces', price: 190 }, { label: '10 pieces', price: 310 }],
  },
  {
    id: 'wings', name: 'Wings', price: 140, cat: 'appetizers', desc: 'Choose BBQ, buffalo or honey mustard', tags: ['chicken', 'wings'],
    variants: [{ label: '8 pieces', price: 140 }],
  },
  { id: 'sharing-is-caring', name: 'Sharing Is Caring', price: 330, cat: 'appetizers', desc: '3 tenders, 3 wings, 3 mozzarella sticks, 3 jalapeno balls, onion rings, special sauce and Thousand Island sauce', tags: ['platter', 'share', 'chicken'] },
  { id: 'mozzarella-sticks', name: 'Mozzarella Sticks', price: 140, cat: 'appetizers', desc: '', tags: ['cheese'] },
  { id: 'onion-rings', name: 'Onion Rings', price: 120, cat: 'appetizers', desc: '', tags: ['onion'] },
  { id: 'jalapeno-cheddar-balls', name: 'Jalapeno Cheddar Balls', price: 150, cat: 'appetizers', desc: '', tags: ['cheese', 'jalapeno'] },
  { id: 'french-fries', name: 'French Fries', price: 90, cat: 'appetizers', desc: '', tags: ['fries', 'chips'] },
  { id: 'animal-fries', name: 'Animal Fries', price: 230, cat: 'appetizers', desc: 'Beef, French fries, cheese, bacon, jalapenos, jalapeno sauce', tags: ['fries', 'beef'] },
  { id: 'mac-n-cheese-appetizers', name: 'Mac N Cheese Appetizers', price: 220, cat: 'appetizers', desc: '', tags: ['cheese', 'mac'] },
  { id: 'cheese-fries', name: 'Cheese Fries', price: 90, cat: 'sides', desc: '', tags: ['fries', 'cheese'] },
  { id: 'coleslaw', name: 'Coleslaw', price: 60, cat: 'sides', desc: '', tags: ['salad'] },
  { id: 'extra-sauce', name: 'Extra Sauce', price: 30, cat: 'sides', desc: '', tags: ['sauce'] },
];

const IMG_OVERRIDE = {
  'smash-burger': ['smash', 'hero'],
  'triple-c': ['aboutburger', 'menuBurger'],
  'french-fries': ['tileFries', 'fries'],
  'animal-fries': ['tileFries', 'fries'],
  'cheese-fries': ['fries', 'tileFries'],
  'extra-sauce': ['fries'],
  coleslaw: ['tileFries'],
  'onion-rings': ['menuChicken', 'tileFries'],
  wings: ['tileChicken', 'menuChicken'],
  tenders: ['menuChicken', 'tileChicken'],
};

ITEMS.forEach((it) => {
  const pool = IMG_OVERRIDE[it.id] || IMG_POOL[it.cat];
  const start = (it.idx || 0) % pool.length;
  it.imgs = pool.map((_, k) => pool[(start + k) % pool.length]);
  it.catLabel = CATEGORIES.find((c) => c.id === it.cat).label;
});
const BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));
const FEATURED_IDS = ['wahala-burger', 'smash-burger', 'triple-c', 'chamis', 'king-c', 'double-trouble', 'sharing-is-caring', 'animal-fries'];

const fmt = (n) => CONFIG.currencyPrefix + n.toLocaleString('en-US');
const linePrice = (item, variantLabel) => {
  if (item.variants) {
    const v = item.variants.find((x) => x.label === variantLabel) || item.variants[0];
    return v.price;
  }
  return item.price;
};
const matches = (item, q) => {
  const t = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!t.length) return true;
  const hay = (item.name + ' ' + item.desc + ' ' + item.catLabel + ' ' + item.tags.join(' ')).toLowerCase();
  return t.every((w) => hay.includes(w));
};
const waLink = (text) => `https://wa.me/${CONFIG.whatsapp.intl}${text ? '?text=' + encodeURIComponent(text) : ''}`;
