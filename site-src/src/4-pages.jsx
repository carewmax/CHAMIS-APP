/* ================= HOME ================= */
function Home() {
  const { go } = useApp();
  const feats = [
    ['burger', 'Beef burgers', '16 on the menu'],
    ['drumstick', 'Chicken burgers', 'Fried, grilled and more'],
    ['flame', 'Wings and tenders', 'BBQ, buffalo, honey mustard'],
    ['chat', 'Order on WhatsApp', CONFIG.whatsapp.display],
  ];
  return (
    <>
      <section className="hero">
        <Img k="hero" alt="A loaded double cheeseburger with fries" className="hero-photo" eager />
        <div className="wrap hero-in">
          <p className="eyebrow gold">Burgers · Chicken · Appetizers</p>
          <h1 className="hero-h">GOOD FOOD<br />BRINGS PEOPLE<span className="script hero-script">Together</span></h1>
          <p className="hero-p">Bold flavours and satisfying favourites. Pick your burger, add something to share, and send your order straight to us.</p>
          <div className="hero-cta">
            <Btn size="lg" onClick={() => go('menu')}>View menu <Icon n="arrow" size={18} /></Btn>
            <Btn size="lg" variant="line" onClick={() => go('menu')}>Order now</Btn>
          </div>
        </div>
      </section>

      <section className="strip">
        <div className="wrap strip-in">
          {feats.map(([ic, t, s]) => (
            <div key={t} className="feat"><span className="feat-ic"><Icon n={ic} size={26} stroke={1.5} /></span><strong>{t}</strong><span className="muted">{s}</span></div>
          ))}
        </div>
      </section>

      <section className="sect">
        <div className="wrap">
          <div className="sect-head"><h2 className="h2">Our <em>Favourites</em></h2><a className="more" href="#menu" onClick={(e) => { e.preventDefault(); go('menu'); }}>Full menu <Icon n="arrow" size={16} /></a></div>
          <div className="tiles">
            {CATEGORIES.filter((c) => c.id !== 'sides').map((c) => (
              <a key={c.id} href={'#menu-' + c.id} className="tile" onClick={(e) => { e.preventDefault(); go('menu', { cat: c.id }); }}>
                <Img k={c.tile} alt="" /><span className="tile-l">{c.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="sect sect-alt">
        <div className="wrap">
          <div className="sect-head"><h2 className="h2">Popular <em>Picks</em></h2></div>
          <div className="pgrid">{FEATURED_IDS.map((id) => <ProductCard key={id} item={BY_ID[id]} />)}</div>
        </div>
      </section>

      <section className="vibes">
        <Img k="banner" alt="" className="vibes-bg" />
        <div className="vibes-shade" />
        <div className="wrap vibes-in">
          <p className="script big">{CONFIG.slogan}</p>
          <div className="vibes-cta">
            <Btn variant="wa" size="lg" href={waLink('Hello Chami\'s, I\'d like to place an order.')}><WaIcon size={22} /> Order on WhatsApp</Btn>
            <Btn variant="line" size="lg" onClick={() => go('contact')}>Contact us</Btn>
          </div>
        </div>
      </section>
    </>
  );
}

/* ================= MENU ================= */
function MenuRow({ item }) {
  const { go, addToCart } = useApp();
  const multi = !!(item.variants && item.variants.length > 1);
  const unit = item.variants && item.variants.length === 1 ? item.variants[0].label : null;
  return (
    <li className="mrow">
      <a className="mrow-main" href={'#p-' + item.id} onClick={(e) => { e.preventDefault(); go('product', { id: item.id }); }}>
        <span className="mrow-name">{item.name}{unit && <span className="unit"> · {unit}</span>}</span>
        {item.desc && <span className="mrow-desc">{item.desc}</span>}
      </a>
      <span className="mrow-price">
        {item.variants && item.variants.length > 1
          ? <span className="vp">{item.variants.map((v) => <span key={v.label}><b>{v.label.replace(' pieces', '')}</b> {fmt(v.price)}</span>)}</span>
          : <Price value={item.price} />}
      </span>
      <button className="add-sm" onClick={() => (multi ? go('product', { id: item.id }) : addToCart(item.id, null, 1))}
        aria-label={multi ? 'Choose size for ' + item.name : 'Add ' + item.name + ' to cart'}><Icon n={multi ? 'arrow' : 'plus'} size={16} stroke={2.4} /></button>
    </li>
  );
}

const CAT_PHOTO = { beef: 'menuBurger', chicken: 'menuChicken', appetizers: 'tileFries', sides: 'fries', drinks: 'tileDrinks' };

function MenuPage() {
  const { route, go } = useApp();
  const cat = route.cat || 'all';
  const [q, setQ] = useState('');
  const cats = CATEGORIES.filter((c) => cat === 'all' || c.id === cat);
  const total = ITEMS.filter((i) => (cat === 'all' || i.cat === cat) && matches(i, q)).length;
  return (
    <>
      <section className="page-head">
        <div className="wrap ph-in">
          <div>
            <h1 className="h1">OUR <em>MENU</em></h1>
            <p className="sub">Prices as listed on our menu.</p>
          </div>
          <p className="script ph-script">{CONFIG.slogan}</p>
        </div>
      </section>
      <div className="wrap">
        <div className="mtools">
          <div className="pills" role="tablist" aria-label="Menu categories">
            <button className={'pill ' + (cat === 'all' ? 'on' : '')} role="tab" aria-selected={cat === 'all'} onClick={() => go('menu')}>All</button>
            {CATEGORIES.map((c) => (
              <button key={c.id} className={'pill ' + (cat === c.id ? 'on' : '')} role="tab" aria-selected={cat === c.id} onClick={() => go('menu', { cat: c.id })}>{c.label}</button>
            ))}
          </div>
          <label className="msearch"><Icon n="search" size={18} /><span className="sr">Filter the menu</span>
            <input id="menu-filter" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter this menu" autoComplete="off" />
          </label>
        </div>

        {total === 0 && cat !== 'drinks' && (
          <Empty title="NO MATCHING ITEMS FOUND" actions={<><Btn variant="line" onClick={() => setQ('')}>Clear search</Btn><Btn onClick={() => go('menu')}>See all items</Btn></>}>
            Nothing here matches “{q}”.
          </Empty>
        )}

        {cats.map((c) => {
          const list = ITEMS.filter((i) => i.cat === c.id && matches(i, q));
          if (!list.length && q) return null;
          return (
            <section key={c.id} className="mcat" id={'cat-' + c.id} aria-labelledby={'h-' + c.id}>
              <div className="mcat-head">
                <Img k={CAT_PHOTO[c.id]} alt="" className="mcat-img" />
                <h2 id={'h-' + c.id}>{c.label}</h2>
                <span className="mcat-n">{list.length} item{list.length === 1 ? '' : 's'}</span>
              </div>
              {list.length === 0 ? (
                <Empty title="Drinks list coming soon">The drinks menu and prices haven't been added yet. Ask on WhatsApp what's available.
                  <span className="empty-actions" style={{ marginTop: 14 }}><Btn variant="wa" href={waLink('Hello Chami\'s, what drinks do you have?')}><WaIcon size={18} /> Ask on WhatsApp</Btn></span>
                </Empty>
              ) : (
                <ul className="mlist">{list.map((i) => <MenuRow key={i.id} item={i} />)}</ul>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}

/* ================= PRODUCT ================= */
function ProductPage() {
  const { route, go, addToCart } = useApp();
  const item = BY_ID[route.id];
  const [qty, setQty] = useState(1);
  const [vi, setVi] = useState(0);
  const [img, setImg] = useState(0);
  const [full, setFull] = useState(false);
  useEffect(() => { setQty(1); setVi(0); setImg(0); setFull(false); }, [route.id]);
  useEsc(full, () => setFull(false));
  if (!item) {
    return <div className="wrap"><Empty title="That item isn't on the menu" actions={<Btn onClick={() => go('menu')}>Back to menu</Btn>}>It may have been renamed or removed.</Empty></div>;
  }
  const variant = item.variants ? item.variants[vi] : null;
  const unit = variant ? variant.price : item.price;
  const related = ITEMS.filter((i) => i.cat === item.cat && i.id !== item.id).slice(0, 4);
  const pair = ['cheese-fries', 'extra-sauce', 'coleslaw'].filter((id) => id !== item.id).map((id) => BY_ID[id]);
  return (
    <div className="wrap prod">
      <a className="back" href="#menu" onClick={(e) => { e.preventDefault(); go('menu', { cat: item.cat }); }}><Icon n="back" size={18} /> Back to menu</a>
      <div className="prod-grid">
        <div className="gallery">
          <button className="gallery-main" onClick={() => setFull(true)} aria-label="View photo full screen">
            <Img k={item.imgs[img]} alt={item.name} key={img} eager />
          </button>
          {item.imgs.length > 1 && (
            <div className="thumbs">
              {item.imgs.map((k, n) => (
                <button key={k + n} className={n === img ? 'on' : ''} onClick={() => setImg(n)} aria-label={'Photo ' + (n + 1)}><Img k={k} alt="" /></button>
              ))}
            </div>
          )}
          <p className="fine">Photos shown are representative while item photos are being added.</p>
        </div>
        <div className="prod-info">
          <a className="eyebrow gold" href={'#menu-' + item.cat} onClick={(e) => { e.preventDefault(); go('menu', { cat: item.cat }); }}>{item.catLabel}</a>
          <h1 className="h1 prod-name">{item.name}</h1>
          <div className="prod-price"><Price value={unit * qty} />{qty > 1 && <span className="muted"> ({fmt(unit)} each)</span>}</div>
          <p className="prod-desc">{item.desc || "The full ingredient list isn't on our menu yet. Ask on WhatsApp if you want to know what's in it."}</p>

          {item.variants && item.variants.length > 1 && (
            <fieldset className="opts">
              <legend>Choose a size</legend>
              {item.variants.map((v, n) => (
                <label key={v.label} className={'opt ' + (vi === n ? 'on' : '')}>
                  <input type="radio" name="variant" checked={vi === n} onChange={() => setVi(n)} id={'v-' + n} />
                  <span>{v.label}</span><Price value={v.price} />
                </label>
              ))}
            </fieldset>
          )}
          {item.variants && item.variants.length === 1 && <p className="muted">{item.variants[0].label}</p>}

          <div className="buy">
            <div className="qty lg" role="group" aria-label="Quantity">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"><Icon n="minus" size={18} /></button>
              <span aria-live="polite">{qty}</span>
              <button onClick={() => setQty(Math.min(50, qty + 1))} aria-label="Increase quantity"><Icon n="plus" size={18} /></button>
            </div>
            <Btn size="lg" className="grow" onClick={() => addToCart(item.id, variant ? variant.label : null, qty)}><Icon n="cart" size={20} /> Add to cart</Btn>
          </div>
          <div className="pair">
            <p className="eyebrow">Goes well with</p>
            <div className="chips">{pair.map((p) => <button key={p.id} className="pill" onClick={() => addToCart(p.id, null, 1)}><Icon n="plus" size={14} stroke={2.4} /> {p.name} <b>{fmt(p.price)}</b></button>)}</div>
          </div>
        </div>
      </div>

      <Reviews itemId={item.id} />

      {related.length > 0 && (
        <section className="rel"><h2 className="h2">More <em>{item.catLabel}</em></h2>
          <div className="pgrid">{related.map((i) => <ProductCard key={i.id} item={i} />)}</div>
        </section>
      )}

      {full && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.name + ' photo'} onClick={() => setFull(false)}>
          <button className="tool lb-x" onClick={() => setFull(false)} aria-label="Close photo"><Icon n="x" /></button>
          <Img k={item.imgs[img]} alt={item.name} />
        </div>
      )}
    </div>
  );
}

function Reviews({ itemId }) {
  const { toast } = useApp();
  const [all, setAll] = useState(() => lsGet('chamis-reviews', {}));
  const list = all[itemId] || [];
  const [form, setForm] = useState({ rating: 0, title: '', text: '', name: '' });
  const [err, setErr] = useState({});
  useEffect(() => { setForm({ rating: 0, title: '', text: '', name: '' }); setErr({}); }, [itemId]);
  const avg = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.rating) er.rating = 'Choose a star rating.';
    if (form.text.trim().length < 5) er.text = 'Write at least a few words.';
    setErr(er);
    if (Object.keys(er).length) return;
    const next = { ...all, [itemId]: [{ ...form, text: form.text.trim(), at: new Date().toISOString().slice(0, 10) }, ...list] };
    setAll(next); lsSet('chamis-reviews', next);
    setForm({ rating: 0, title: '', text: '', name: '' });
    toast('Review saved on this device');
  };
  return (
    <section className="reviews" aria-labelledby="rv-h">
      <div className="rv-head">
        <h2 className="h2" id="rv-h">Customer <em>Reviews</em></h2>
        {list.length > 0 && <div className="rv-avg"><Stars value={avg} /><span>{avg.toFixed(1)} from {list.length} review{list.length > 1 ? 's' : ''} on this device</span></div>}
      </div>
      <div className="rv-grid">
        <div>
          {list.length === 0 ? (
            <Empty title="No reviews yet">Chami's hasn't published customer reviews on this site. Write one below to see how it looks.</Empty>
          ) : (
            <ul className="rv-list">
              {list.map((r, n) => (
                <li key={n} className="rv"><Stars value={r.rating} size={16} />{r.title && <strong>{r.title}</strong>}<p>{r.text}</p><span className="muted">{r.name || 'You'} · {r.at} · saved on this device only</span></li>
              ))}
            </ul>
          )}
        </div>
        <form className="form card" onSubmit={submit} noValidate>
          <h3>Write a review</h3>
          <div className="field"><span className="lbl" id="rate-l">Rating</span><Stars value={form.rating} onChange={(n) => setForm({ ...form, rating: n })} size={26} name="rate" />
            {err.rating && <span className="err" role="alert">{err.rating}</span>}</div>
          <div className="field"><label htmlFor="rv-title">Title (optional)</label><input id="rv-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="field"><label htmlFor="rv-text">Your review</label><textarea id="rv-text" rows="4" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} aria-invalid={!!err.text} />
            {err.text && <span className="err" role="alert">{err.text}</span>}</div>
          <div className="field"><label htmlFor="rv-name">Your name (optional)</label><input id="rv-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <Btn type="submit">Save review</Btn>
          <p className="fine">Saved in this browser only. It isn't sent to Chami's or shown to other customers.</p>
        </form>
      </div>
    </section>
  );
}

/* ================= ABOUT ================= */
function About() {
  const { go } = useApp();
  const steps = [
    ['list', 'Pick your food', 'Browse the menu, search by name, and add items to your cart.'],
    ['chat', 'Send your order', 'Checkout builds your order message and opens WhatsApp so you can send it to us.'],
    ['phone', 'Call if you need us', 'Questions about an item or your order? Call or message the numbers on the Contact page.'],
  ];
  return (
    <>
      <section className="about-hero">
        <Img k="store" alt="Chami's House of Food storefront at night" className="about-bg" eager />
        <div className="about-shade" />
        <div className="wrap about-in">
          <h1 className="h1">ABOUT <em>US</em></h1>
          <p className="script">Our Story</p>
          <p className="lead">More than food. It's an experience. Chami's House of Food is where bold flavours and satisfying favourites bring people together.</p>
        </div>
      </section>

      <section className="sect">
        <div className="wrap about-split">
          <div>
            <h2 className="h2">What we <em>serve</em></h2>
            <p className="body-lg">Burgers are the heart of the menu: sixteen beef burgers and a long line of chicken burgers, from fried to grilled to escalope. Alongside them sit wings, tenders, loaded fries and a sharing platter built for the table.</p>
            <ul className="serve">
              {CATEGORIES.filter((c) => c.id !== 'drinks').map((c) => (
                <li key={c.id}><a href={'#menu-' + c.id} onClick={(e) => { e.preventDefault(); go('menu', { cat: c.id }); }}><strong>{c.label}</strong><span className="muted">{ITEMS.filter((i) => i.cat === c.id).length} items</span><Icon n="arrow" size={16} /></a></li>
              ))}
            </ul>
            <Btn onClick={() => go('menu')}>Explore the menu <Icon n="arrow" size={18} /></Btn>
          </div>
          <div className="about-photo"><Img k="aboutburger" alt="A stacked burger with melted cheese" /></div>
        </div>
      </section>

      <section className="sect sect-alt">
        <div className="wrap">
          <h2 className="h2">How ordering <em>works</em></h2>
          <ol className="steps">
            {steps.map(([ic, t, d], n) => (
              <li key={t}><span className="feat-ic"><Icon n={ic} size={26} stroke={1.5} /></span><strong>{t}</strong><p>{d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="vibes small">
        <Img k="smash" alt="" className="vibes-bg" />
        <div className="vibes-shade" />
        <div className="wrap vibes-in">
          <p className="script big">More Than Food. It's a Lifestyle.</p>
          <Btn size="lg" onClick={() => go('contact')}>Get in touch <Icon n="arrow" size={18} /></Btn>
        </div>
      </section>
    </>
  );
}

/* ================= CONTACT ================= */
function Contact() {
  const [f, setF] = useState({ name: '', contact: '', subject: '', message: '' });
  const [err, setErr] = useState({});
  const [ready, setReady] = useState(null);
  const msgText = (x) => `Hello Chami's,\n${x.subject ? 'Subject: ' + x.subject + '\n' : ''}${x.message}\n\nFrom: ${x.name}${x.contact ? ' (' + x.contact + ')' : ''}`;
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = 'Enter your name.';
    if (f.message.trim().length < 3) er.message = 'Write your message.';
    setErr(er);
    if (Object.keys(er).length) return;
    setReady(msgText(f));
  };
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setReady(null); };
  return (
    <>
      <section className="contact-hero">
        <Img k="smash" alt="" className="contact-photo" eager />
        <div className="contact-shade" />
        <div className="wrap contact-in">
          <h1 className="contact-h">CONTACT</h1>
          <p className="script contact-us">Us Today!</p>
          <p className="ribbon">FOR ORDERS &amp; INQUIRIES</p>
          <div className="cpanel wa">
            <span className="cp-ic"><WaIcon size={46} /></span>
            <div>
              <a className="cp-num" href={'tel:+' + CONFIG.whatsapp.intl}>{CONFIG.whatsapp.display}</a>
              <span className="cp-tag"><b>AVAILABLE ON</b> WHATSAPP &amp; DIRECT CALL</span>
            </div>
            <div className="cp-act">
              <Btn variant="wa" href={waLink('Hello Chami\'s!')}><WaIcon size={18} /> Chat</Btn>
              <Btn variant="line" href={'tel:+' + CONFIG.whatsapp.intl}><Icon n="phone" size={16} /> Call</Btn>
              <CopyBtn text={CONFIG.whatsapp.display} />
            </div>
          </div>
          <div className="cpanel call">
            <span className="cp-ic gold"><Icon n="phone" size={34} stroke={1.8} /></span>
            <div>
              <a className="cp-num" href={'tel:+' + CONFIG.call.intl}>{CONFIG.call.display}</a>
              <span className="cp-tag gold"><b>DIRECT CALL ONLY</b></span>
            </div>
            <div className="cp-act">
              <Btn variant="gold" href={'tel:+' + CONFIG.call.intl}><Icon n="phone" size={16} /> Call</Btn>
              <CopyBtn text={CONFIG.call.display} />
            </div>
          </div>
          <p className="fine">If a call or chat button does nothing on your device, copy the number and dial it directly.</p>
          <p className="script slogan-sm">{CONFIG.slogan}</p>
        </div>
      </section>

      <section className="sect">
        <div className="wrap cform-wrap">
          <div>
            <h2 className="h2">Send us a <em>message</em></h2>
            <p className="body-lg">Fill this in and we'll open WhatsApp with your message ready to send. It only reaches Chami's once you press send there.</p>
          </div>
          <form className="form card" onSubmit={submit} noValidate>
            <div className="field"><label htmlFor="c-name">Name</label><input id="c-name" value={f.name} onChange={set('name')} autoComplete="name" aria-invalid={!!err.name} />{err.name && <span className="err" role="alert">{err.name}</span>}</div>
            <div className="field"><label htmlFor="c-contact">Phone or email (optional)</label><input id="c-contact" value={f.contact} onChange={set('contact')} autoComplete="tel" /></div>
            <div className="field"><label htmlFor="c-subject">Subject (optional)</label><input id="c-subject" value={f.subject} onChange={set('subject')} /></div>
            <div className="field"><label htmlFor="c-msg">Message</label><textarea id="c-msg" rows="5" value={f.message} onChange={set('message')} aria-invalid={!!err.message} />{err.message && <span className="err" role="alert">{err.message}</span>}</div>
            <Btn type="submit">Prepare message</Btn>
            {ready && (
              <div className="ready" role="status">
                <p><strong>Your message is ready.</strong> It has not been sent yet.</p>
                <pre>{ready}</pre>
                <div className="row"><Btn variant="wa" href={waLink(ready)}><WaIcon size={18} /> Open in WhatsApp</Btn><CopyBtn text={ready} label="Copy message" /></div>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

/* ================= CHECKOUT ================= */
function buildOrderText(lines, subtotal, c) {
  const rows = lines.map((l) => `• ${l.qty} × ${l.item.name}${l.variant ? ' (' + l.variant + ')' : ''} – ${fmt(l.price * l.qty)}`).join('\n');
  return `Hello Chami's, I'd like to order:\n${rows}\n\nTotal: ${fmt(subtotal)}\n\nName: ${c.name}\nPhone: ${c.phone}${c.notes ? '\nAddress / notes: ' + c.notes : ''}`;
}

function Checkout() {
  const { lines, subtotal, go, setQty, removeLine, profile, setOrder } = useApp();
  const [c, setC] = useState({ name: profile.name || '', phone: profile.phone || '', notes: profile.address || '' });
  const [err, setErr] = useState({});
  if (lines.length === 0) {
    return <div className="wrap"><Empty title="Your cart is empty" actions={<Btn onClick={() => go('menu')}>Browse the menu</Btn>}>Add something from the menu to start an order.</Empty></div>;
  }
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!c.name.trim()) er.name = 'Enter your name.';
    if (!/^[+\d][\d\s/()-]{5,}$/.test(c.phone.trim())) er.phone = 'Enter a phone number we can reach, for example 076123456.';
    setErr(er);
    if (Object.keys(er).length) return;
    const text = buildOrderText(lines, subtotal, c);
    const o = { text, total: subtotal, count: lines.reduce((s, l) => s + l.qty, 0), at: new Date().toISOString().slice(0, 16).replace('T', ' '), lines: lines.map((l) => ({ name: l.item.name, variant: l.variant, qty: l.qty, price: l.price })) };
    setOrder(o);
    go('confirmation');
  };
  return (
    <div className="wrap co">
      <h1 className="h1">CHECK<em>OUT</em></h1>
      <div className="co-grid">
        <form className="form card" onSubmit={submit} noValidate>
          <h2>Your details</h2>
          <div className="field"><label htmlFor="o-name">Name</label><input id="o-name" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} autoComplete="name" aria-invalid={!!err.name} />{err.name && <span className="err" role="alert">{err.name}</span>}</div>
          <div className="field"><label htmlFor="o-phone">Phone number</label><input id="o-phone" type="tel" value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} autoComplete="tel" aria-invalid={!!err.phone} />{err.phone && <span className="err" role="alert">{err.phone}</span>}</div>
          <div className="field"><label htmlFor="o-notes">Address or notes (optional)</label><textarea id="o-notes" rows="3" value={c.notes} onChange={(e) => setC({ ...c, notes: e.target.value })} placeholder="Delivery address, pickup time, anything we should know" /></div>
          <div className="notice"><Icon n="chat" size={18} /><p>Payment and delivery aren't handled on this site. Your order opens in WhatsApp, and Chami's confirms details and any charges with you there.</p></div>
          <Btn type="submit" size="lg">Review and send order <Icon n="arrow" size={18} /></Btn>
        </form>
        <aside className="card sumbox" aria-label="Order summary">
          <h2>Order summary</h2>
          <ul className="lines">
            {lines.map((l) => (
              <li key={l.key} className="line">
                <Img k={l.item.imgs[0]} alt="" className="line-img" />
                <div className="line-info"><strong>{l.item.name}</strong>{l.variant && <span className="muted">{l.variant}</span>}<Price value={l.price * l.qty} /></div>
                <div className="qty"><button onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease quantity"><Icon n="minus" size={16} /></button><span>{l.qty}</span><button onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase quantity"><Icon n="plus" size={16} /></button></div>
                <button className="line-rm" onClick={() => removeLine(l.key)} aria-label={'Remove ' + l.item.name}><Icon n="trash" size={18} /></button>
              </li>
            ))}
          </ul>
          <div className="sum total"><span>Total</span><Price value={subtotal} /></div>
          <Btn variant="line" onClick={() => go('menu')}>Continue shopping</Btn>
        </aside>
      </div>
    </div>
  );
}

function Confirmation() {
  const { order, go, clearCart, saveOrderHistory } = useApp();
  const [saved, setSaved] = useState(false);
  if (!order) return <div className="wrap"><Empty title="No order to show" actions={<Btn onClick={() => go('menu')}>Browse the menu</Btn>}>Build an order from the menu first.</Empty></div>;
  return (
    <div className="wrap conf">
      <div className="conf-card card">
        <span className="conf-ic"><Icon n="orders" size={38} stroke={1.5} /></span>
        <h1 className="h1 conf-h">YOUR ORDER IS <em>READY TO SEND</em></h1>
        <p className="conf-warn" role="status">It has not been sent to Chami's yet. Press the button, then press send in WhatsApp.</p>
        <div className="ready"><pre>{order.text}</pre></div>
        <div className="row center">
          <Btn variant="wa" size="lg" href={waLink(order.text)} onClick={() => { if (!saved) { saveOrderHistory(order); setSaved(true); } }}><WaIcon size={22} /> Send order on WhatsApp</Btn>
          <CopyBtn text={order.text} label="Copy order" />
        </div>
        <p className="fine">No payment has been taken. Chami's will confirm the price, delivery or pickup with you.</p>
        <div className="row center">
          <Btn variant="line" onClick={() => { clearCart(); go('menu'); }}>I've sent it. Clear my cart</Btn>
          <Btn variant="line" onClick={() => go('checkout')}>Edit order</Btn>
          <Btn variant="line" onClick={() => go('home')}>Back to home</Btn>
        </div>
      </div>
    </div>
  );
}

/* ================= ACCOUNT (prototype, local only) ================= */
function Account() {
  const { profile, setProfile, history, toast, go, clearHistory } = useApp();
  const [p, setP] = useState(profile);
  const [tab, setTab] = useState('details');
  return (
    <div className="wrap acct">
      <h1 className="h1">MY <em>ACCOUNT</em></h1>
      <div className="notice"><Icon n="user" size={18} /><p>This is a prototype without sign-in. Your details and past orders are saved in this browser only, and are used to fill in checkout for you.</p></div>
      <div className="pills" role="tablist" aria-label="Account sections">
        <button className={'pill ' + (tab === 'details' ? 'on' : '')} role="tab" aria-selected={tab === 'details'} onClick={() => setTab('details')}>My details</button>
        <button className={'pill ' + (tab === 'orders' ? 'on' : '')} role="tab" aria-selected={tab === 'orders'} onClick={() => setTab('orders')}>Orders on this device ({history.length})</button>
      </div>
      {tab === 'details' ? (
        <form className="form card narrow" onSubmit={(e) => { e.preventDefault(); setProfile(p); toast('Details saved on this device'); }}>
          <div className="field"><label htmlFor="a-name">Name</label><input id="a-name" value={p.name || ''} onChange={(e) => setP({ ...p, name: e.target.value })} autoComplete="name" /></div>
          <div className="field"><label htmlFor="a-phone">Phone number</label><input id="a-phone" type="tel" value={p.phone || ''} onChange={(e) => setP({ ...p, phone: e.target.value })} autoComplete="tel" /></div>
          <div className="field"><label htmlFor="a-addr">Delivery address</label><textarea id="a-addr" rows="3" value={p.address || ''} onChange={(e) => setP({ ...p, address: e.target.value })} /></div>
          <div className="row"><Btn type="submit">Save details</Btn><Btn variant="line" onClick={() => { setP({}); setProfile({}); toast('Details cleared'); }}>Clear</Btn></div>
        </form>
      ) : history.length === 0 ? (
        <Empty title="No orders yet" actions={<Btn onClick={() => go('menu')}>Browse the menu</Btn>}>Orders you open in WhatsApp from this browser will be listed here. Chami's keeps its own record of anything you actually send.</Empty>
      ) : (
        <div className="hist">
          {history.map((o, n) => (
            <article key={n} className="card hist-i">
              <header><strong>{o.count} item{o.count > 1 ? 's' : ''}</strong><Price value={o.total} /><span className="muted">{o.at}</span></header>
              <ul>{o.lines.map((l, k) => <li key={k}>{l.qty} × {l.name}{l.variant ? ' (' + l.variant + ')' : ''}</li>)}</ul>
            </article>
          ))}
          <Btn variant="line" onClick={clearHistory}>Clear order history</Btn>
        </div>
      )}
    </div>
  );
}
