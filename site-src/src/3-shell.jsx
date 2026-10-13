/* ---------- header / nav ---------- */
const NAV = [['home', 'Home'], ['menu', 'Menu'], ['about', 'About'], ['contact', 'Contact']];

function Header() {
  const { route, go, cartCount, ui, setUi } = useApp();
  const active = route.name === 'product' ? 'menu' : route.name;
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <a className="hdr-logo" href="#home" onClick={(e) => { e.preventDefault(); go('home'); }} aria-label="Chami's House of Food, home"><Logo /></a>
        <nav className="hdr-nav" aria-label="Main">
          {NAV.map(([n, l]) => (
            <a key={n} href={'#' + n} className={active === n ? 'on' : ''} aria-current={active === n ? 'page' : undefined}
              onClick={(e) => { e.preventDefault(); go(n); }}>{l}</a>
          ))}
        </nav>
        <div className="hdr-tools">
          <button className="tool" onClick={() => setUi({ ...ui, search: true })} aria-label="Search the menu"><Icon n="search" /></button>
          <button className={'tool hide-sm ' + (route.name === 'account' ? 'on' : '')} onClick={() => go('account')} aria-label="My account"><Icon n="user" /></button>
          <button className="tool" onClick={() => setUi({ ...ui, cart: true })} aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}>
            <Icon n="cart" />{cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
          <button className="tool burger-btn" onClick={() => setUi({ ...ui, nav: true })} aria-label="Open menu" aria-expanded={ui.nav}><Icon n="menu" /></button>
        </div>
      </div>
    </header>
  );
}

function useEsc(open, close) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, close]);
}

function MobileNav() {
  const { route, go, ui, setUi } = useApp();
  const close = useCallback(() => setUi((u) => ({ ...u, nav: false })), [setUi]);
  useEsc(ui.nav, close);
  const closeRef = useRef(null);
  useEffect(() => { if (ui.nav && closeRef.current) closeRef.current.focus(); }, [ui.nav]);
  if (!ui.nav) return null;
  const link = (n, l, props) => (
    <a key={n} href={'#' + n} className={route.name === n ? 'on' : ''} onClick={(e) => { e.preventDefault(); go(n, props); close(); }}>{l}</a>
  );
  return (
    <div className="overlay" onClick={close}>
      <aside className="mnav" role="dialog" aria-modal="true" aria-label="Site menu" onClick={(e) => e.stopPropagation()}>
        <div className="mnav-top"><Logo /><button ref={closeRef} className="tool" onClick={close} aria-label="Close menu"><Icon n="x" /></button></div>
        <nav className="mnav-links" aria-label="Mobile">
          {NAV.map(([n, l]) => link(n, l))}
          {link('account', 'My account')}
          {link('checkout', 'Checkout')}
        </nav>
        <div className="mnav-contact">
          <p className="eyebrow">Order and enquiries</p>
          <Btn variant="wa" href={waLink('')}><WaIcon size={20} /> WhatsApp {CONFIG.whatsapp.display}</Btn>
          <Btn variant="line" href={'tel:+' + CONFIG.call.intl}><Icon n="phone" size={18} /> Call {CONFIG.call.display}</Btn>
        </div>
      </aside>
    </div>
  );
}

/* ---------- cart drawer ---------- */
function CartDrawer() {
  const { ui, setUi, lines, subtotal, setQty, removeLine, go } = useApp();
  const close = useCallback(() => setUi((u) => ({ ...u, cart: false })), [setUi]);
  useEsc(ui.cart, close);
  const closeRef = useRef(null);
  useEffect(() => { if (ui.cart && closeRef.current) closeRef.current.focus(); }, [ui.cart]);
  if (!ui.cart) return null;
  return (
    <div className="overlay" onClick={close}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Your cart" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-top">
          <h2><Icon n="cart" size={22} /> Your Cart</h2>
          <button ref={closeRef} className="tool" onClick={close} aria-label="Close cart"><Icon n="x" /></button>
        </div>
        {lines.length === 0 ? (
          <Empty title="Your cart is empty" actions={<Btn onClick={() => { close(); go('menu'); }}>Browse the menu</Btn>}>
            Add a burger, some wings or a sharing platter and it will show up here.
          </Empty>
        ) : (
          <>
            <ul className="lines">
              {lines.map((l) => (
                <li key={l.key} className="line">
                  <Img k={l.item.imgs[0]} alt="" className="line-img" />
                  <div className="line-info">
                    <strong>{l.item.name}</strong>
                    {l.variant && <span className="muted">{l.variant}</span>}
                    <Price value={l.price} />
                  </div>
                  <div className="qty" role="group" aria-label={'Quantity of ' + l.item.name}>
                    <button onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease quantity"><Icon n="minus" size={16} /></button>
                    <span aria-live="polite">{l.qty}</span>
                    <button onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase quantity"><Icon n="plus" size={16} /></button>
                  </div>
                  <button className="line-rm" onClick={() => removeLine(l.key)} aria-label={'Remove ' + l.item.name}><Icon n="trash" size={18} /></button>
                </li>
              ))}
            </ul>
            <div className="drawer-foot">
              <div className="sum"><span>Subtotal</span><Price value={subtotal} /></div>
              <p className="fine">Delivery, pickup and any fees are arranged with Chami's when you send your order.</p>
              <Btn size="lg" onClick={() => { close(); go('checkout'); }}>Proceed to checkout <Icon n="arrow" size={18} /></Btn>
              <Btn variant="line" onClick={() => { close(); go('menu'); }}>Continue shopping</Btn>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/* ---------- search overlay ---------- */
function SearchOverlay() {
  const { ui, setUi, go, addToCart } = useApp();
  const [q, setQ] = useState('');
  const close = useCallback(() => setUi((u) => ({ ...u, search: false })), [setUi]);
  useEsc(ui.search, close);
  const inputRef = useRef(null);
  useEffect(() => { if (ui.search && inputRef.current) inputRef.current.focus(); }, [ui.search]);
  const results = useMemo(() => (q.trim() ? ITEMS.filter((i) => matches(i, q)).slice(0, 40) : []), [q]);
  if (!ui.search) return null;
  const chips = ['Burger', 'Chicken', 'Wings', 'Fries', 'Cheese', 'Sauce'];
  return (
    <div className="overlay top" onClick={close}>
      <div className="search" role="dialog" aria-modal="true" aria-label="Search the menu" onClick={(e) => e.stopPropagation()}>
        <div className="search-bar">
          <Icon n="search" size={20} />
          <input ref={inputRef} id="menu-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for your favourite food" aria-label="Search the menu" autoComplete="off" />
          {q && <button className="tool sm" onClick={() => { setQ(''); inputRef.current && inputRef.current.focus(); }} aria-label="Clear search"><Icon n="x" size={16} /></button>}
          <button className="chip-btn" onClick={close}>Close</button>
        </div>
        <div className="search-body">
          {!q.trim() && (
            <>
              <p className="eyebrow">Popular searches</p>
              <div className="chips">{chips.map((c) => <button key={c} className="pill" onClick={() => setQ(c)}>{c}</button>)}</div>
            </>
          )}
          {q.trim() && results.length === 0 && (
            <Empty title="NO MATCHING ITEMS FOUND" actions={<><Btn variant="line" onClick={() => setQ('')}>Clear search</Btn><Btn onClick={() => { close(); go('menu'); }}>See the full menu</Btn></>}>
              Nothing on the menu matches “{q}”. Try a different word, such as burger, wings or fries.
            </Empty>
          )}
          {results.length > 0 && (
            <>
              <p className="eyebrow">{results.length} result{results.length === 1 ? '' : 's'}</p>
              <ul className="results">
                {results.map((i) => (
                  <li key={i.id} className="result">
                    <button className="result-main" onClick={() => { close(); go('product', { id: i.id }); }}>
                      <Img k={i.imgs[0]} alt="" className="result-img" />
                      <span className="result-txt"><strong>{i.name}</strong><span className="muted">{i.catLabel}</span></span>
                      <Price value={i.price} />
                    </button>
                    <button className="add-sm" onClick={() => (i.variants && i.variants.length > 1 ? (close(), go('product', { id: i.id })) : addToCart(i.id, null, 1))}
                      aria-label={'Add ' + i.name + ' to cart'}><Icon n="plus" size={18} stroke={2.4} /></button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- toast, footer, splash ---------- */
function Toast() {
  const { toastMsg, ui, setUi } = useApp();
  if (!toastMsg) return null;
  return (
    <div className="toast" role="status">
      <Icon n="check" size={18} stroke={2.6} /> <span>{toastMsg.text}</span>
      {toastMsg.cart && !ui.cart && <button className="toast-act" onClick={() => setUi({ ...ui, cart: true })}>View cart</button>}
    </div>
  );
}

function Footer() {
  const { go } = useApp();
  const a = (route, props, label) => <a href={'#' + route} onClick={(e) => { e.preventDefault(); go(route, props); }}>{label}</a>;
  return (
    <footer className="ftr">
      <div className="wrap ftr-grid">
        <div className="ftr-brand">
          <Logo size="lg" />
          <p className="script">{CONFIG.slogan}</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li>{a('home', null, 'Home')}</li><li>{a('menu', null, 'Menu')}</li><li>{a('about', null, 'About Us')}</li><li>{a('contact', null, 'Contact Us')}</li>
          </ul>
        </div>
        <div>
          <h4>Our Menu</h4>
          <ul>{CATEGORIES.map((c) => <li key={c.id}>{a('menu', { cat: c.id }, c.label)}</li>)}</ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul className="ftr-contact">
            <li><span className="muted">WhatsApp and call</span><br /><a href={'tel:+' + CONFIG.whatsapp.intl}>{CONFIG.whatsapp.display}</a></li>
            <li><span className="muted">Call only</span><br /><a href={'tel:+' + CONFIG.call.intl}>{CONFIG.call.display}</a></li>
          </ul>
        </div>
      </div>
      <div className="wrap ftr-base"><span>© {new Date().getFullYear()} Chami's House of Food</span><span>GREAT FOOD. GREAT EXPERIENCE.</span></div>
    </footer>
  );
}

function Splash() {
  return <div className="splash" aria-hidden="true"><Logo size="xl" /></div>;
}
