/* ---------- router (hash tokens such as #menu-chicken, #p-wahala-burger) ---------- */
function parseHash(h) {
  const t = (h || '').replace(/^#\/?/, '');
  if (!t || t === 'home') return { name: 'home' };
  if (t === 'menu') return { name: 'menu' };
  if (t.startsWith('menu-')) {
    const cat = t.slice(5);
    return CATEGORIES.some((c) => c.id === cat) ? { name: 'menu', cat } : { name: 'menu' };
  }
  if (t.startsWith('p-')) return { name: 'product', id: t.slice(2) };
  if (['about', 'contact', 'checkout', 'confirmation', 'account'].includes(t)) return { name: t };
  return { name: 'home' };
}
function toHash(name, props) {
  if (name === 'home') return '#home';
  if (name === 'menu') return props && props.cat ? '#menu-' + props.cat : '#menu';
  if (name === 'product') return '#p-' + props.id;
  return '#' + name;
}

const TITLES = {
  home: "Chami's House of Food | Burgers, Chicken and More",
  menu: "Menu | Chami's House of Food",
  about: "About Us | Chami's House of Food",
  contact: "Contact Us | Chami's House of Food",
  checkout: "Checkout | Chami's House of Food",
  confirmation: "Your Order | Chami's House of Food",
  account: "My Account | Chami's House of Food",
};

function cartReducer(state, a) {
  switch (a.type) {
    case 'add': {
      const key = a.id + '|' + (a.variant || '');
      const ex = state.find((l) => l.key === key);
      if (ex) return state.map((l) => (l.key === key ? { ...l, qty: Math.min(50, l.qty + a.qty) } : l));
      return [...state, { key, id: a.id, variant: a.variant, qty: a.qty }];
    }
    case 'qty': return a.qty < 1 ? state.filter((l) => l.key !== a.key) : state.map((l) => (l.key === a.key ? { ...l, qty: Math.min(50, a.qty) } : l));
    case 'remove': return state.filter((l) => l.key !== a.key);
    case 'clear': return [];
    default: return state;
  }
}

function App() {
  const [route, setRoute] = useState(() => parseHash(typeof location !== 'undefined' ? location.hash : ''));
  const [ui, setUi] = useState({ nav: false, cart: false, search: false });
  const [raw, dispatch] = useReducer(cartReducer, null, () => lsGet('chamis-cart', []).filter((l) => BY_ID[l.id]));
  const [toastMsg, setToastMsg] = useState(null);
  const [order, setOrder] = useState(null);
  const [profile, setProfileState] = useState(() => lsGet('chamis-profile', {}));
  const [history, setHistory] = useState(() => lsGet('chamis-orders', []));
  const toastTimer = useRef(null);

  useEffect(() => { lsSet('chamis-cart', raw); }, [raw]);

  const lines = useMemo(() => raw.map((l) => {
    const item = BY_ID[l.id];
    return { ...l, item, price: linePrice(item, l.variant) };
  }), [raw]);
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const cartCount = lines.reduce((s, l) => s + l.qty, 0);

  const toast = useCallback((text, cart) => {
    setToastMsg({ text, cart: !!cart });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 3200);
  }, []);

  const go = useCallback((name, props) => {
    const r = name === 'product' ? { name, id: props.id } : name === 'menu' ? { name, cat: props && props.cat } : { name };
    setRoute(r);
    setUi({ nav: false, cart: false, search: false });
    try { history_replace(toHash(name, props)); } catch (e) { /* ignore */ }
    window.scrollTo(0, 0);
  }, []);
  function history_replace(h) { if (location.hash !== h) location.hash = h; }

  useEffect(() => {
    const on = () => { setRoute(parseHash(location.hash)); setUi({ nav: false, cart: false, search: false }); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  useEffect(() => {
    const it = route.name === 'product' ? BY_ID[route.id] : null;
    document.title = it ? `${it.name} | Chami's House of Food` : TITLES[route.name] || TITLES.home;
  }, [route]);

  useEffect(() => {
    const lock = ui.nav || ui.cart || ui.search;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [ui]);

  const addToCart = useCallback((id, variant, qty) => {
    const it = BY_ID[id];
    dispatch({ type: 'add', id, variant: variant || (it.variants ? it.variants[0].label : null), qty });
    toast(`Added ${qty > 1 ? qty + ' × ' : ''}${it.name}`, true);
  }, [toast]);

  const ctx = {
    route, go, ui, setUi, lines, subtotal, cartCount, toast, toastMsg, addToCart,
    setQty: (key, qty) => dispatch({ type: 'qty', key, qty }),
    removeLine: (key) => { dispatch({ type: 'remove', key }); toast('Item removed'); },
    clearCart: () => dispatch({ type: 'clear' }),
    order, setOrder, profile, history,
    setProfile: (p) => { setProfileState(p); lsSet('chamis-profile', p); },
    saveOrderHistory: (o) => { const h = [o, ...history].slice(0, 20); setHistory(h); lsSet('chamis-orders', h); },
    clearHistory: () => { setHistory([]); lsSet('chamis-orders', []); },
  };

  let page;
  switch (route.name) {
    case 'menu': page = <MenuPage key={'m' + (route.cat || 'all')} />; break;
    case 'product': page = <ProductPage />; break;
    case 'about': page = <About />; break;
    case 'contact': page = <Contact />; break;
    case 'checkout': page = <Checkout />; break;
    case 'confirmation': page = <Confirmation />; break;
    case 'account': page = <Account />; break;
    default: page = <Home />;
  }

  return (
    <AppCtx.Provider value={ctx}>
      <Splash />
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); const m = document.getElementById('main'); if (m) m.focus(); }}>Skip to content</a>
      <Header />
      <main id="main" tabIndex="-1" key={route.name + (route.id || '')} className="page">{page}</main>
      <Footer />
      <MobileNav />
      <CartDrawer />
      <SearchOverlay />
      <Toast />
    </AppCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
