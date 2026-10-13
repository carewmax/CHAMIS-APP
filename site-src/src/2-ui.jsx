const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext, useReducer } = React;

/* ---------- storage (per-viewer, always guarded) ---------- */
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } };

const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

/* ---------- icons ---------- */
const P = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></>,
  cart: <><path d="M3 4h2.5l2.2 11h10.6l2-8H6.4" /><circle cx="9.5" cy="19.5" r="1.4" /><circle cx="17" cy="19.5" r="1.4" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  x: <><path d="m6 6 12 12M18 6 6 18" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  minus: <><path d="M5 12h14" /></>,
  trash: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></>,
  phone: <><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  back: <><path d="M19 12H5M11 6l-6 6 6 6" /></>,
  check: <><path d="m5 12.5 4.5 4.5L19 7" /></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
  star: <><path d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8Z" /></>,
  burger: <><path d="M4 11a8 6 0 0 1 16 0Z" /><path d="M3 15h18" /><path d="M5 15c0 3 2 5 4 5h6c2 0 4-2 4-5" /></>,
  drumstick: <><path d="M14.5 4.5a5 5 0 0 1 5 5c0 3-3 5-5 5l-3-3c0-2 1-6 3-7Z" /><path d="m11 13-6 6M4 17l3 3" /></>,
  flame: <><path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9Z" /></>,
  list: <><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /></>,
  chat: <><path d="M4 5h16v11H9l-5 4Z" /></>,
  orders: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
  pin: <><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
};
function Icon({ n, size = 20, stroke = 1.8, className = '' }) {
  return (
    <svg className={'ico ' + className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{P[n]}</svg>
  );
}
function WaIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.200Zm4.5-6.1c-.2-.1-1.500-.7-1.700-.8-.2-.1-.4-.1-.6.100l-.8 1c-.1.200-.3.200-.5.100a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.100-.7.300-.7.700-1 1.500-1 2.400.1 1.100.5 2.100 1.200 3 1.300 1.700 3 3 5 3.700.7.300 2 .600 2.700.500.800-.100 1.700-.600 1.900-1.300.2-.6.200-1.200.2-1.300-.1-.200-.3-.200-.6-.400Z" />
    </svg>
  );
}

/* ---------- brand ---------- */
/* Recreated wordmark. Swap for the supplied logo file when it is available. */
function Logo({ size = 'md' }) {
  return (
    <span className={'logo logo-' + size} aria-label="Chami's House of Food">
      <span className="logo-main">CHAMI'S</span>
      <span className="logo-sub"><i />HOUSE OF FOOD<i /></span>
    </span>
  );
}
const Img = ({ k, alt = '', className = '', style, eager }) => (
  <img className={className} src={IMG[k]} alt={alt} style={style} loading={eager ? 'eager' : 'lazy'} decoding="async" />
);

/* ---------- small shared pieces ---------- */
function Price({ value, className = '' }) {
  return <span className={'price ' + className}>{fmt(value)}</span>;
}
function Btn({ children, variant = 'gold', onClick, href, size, className = '', type, disabled, ...rest }) {
  const cls = `btn btn-${variant} ${size ? 'btn-' + size : ''} ${className}`;
  if (href) {
    const ext = /^https?:/.test(href);
    return <a className={cls} href={href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} onClick={onClick} {...rest}>{children}</a>;
  }
  return <button className={cls} type={type || 'button'} onClick={onClick} disabled={disabled} {...rest}>{children}</button>;
}
function Empty({ title, children, actions }) {
  return (
    <div className="empty" role="status">
      <div className="empty-mark"><Icon n="burger" size={34} stroke={1.4} /></div>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {actions && <div className="empty-actions">{actions}</div>}
    </div>
  );
}
function Stars({ value, size = 18, onChange, name }) {
  return (
    <span className="stars" role={onChange ? 'radiogroup' : 'img'} aria-label={onChange ? 'Rating' : `${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) =>
        onChange ? (
          <button type="button" key={n} className={'star-btn ' + (n <= value ? 'on' : '')} role="radio" aria-checked={n === value}
            aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => onChange(n)} id={name ? name + '-' + n : undefined}>
            <Icon n="star" size={size} stroke={1.5} />
          </button>
        ) : (
          <span key={n} className={'star-btn ' + (n <= Math.round(value) ? 'on' : '')}><Icon n="star" size={size} stroke={1.5} /></span>
        )
      )}
    </span>
  );
}
function CopyBtn({ text, label = 'Copy' }) {
  const { toast } = useApp();
  const copy = () => {
    const done = () => toast('Copied');
    const fail = () => toast('Copy is blocked here. Select the text and copy it.');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fail);
      else fail();
    } catch (e) { fail(); }
  };
  return <button type="button" className="chip-btn" onClick={copy}><Icon n="copy" size={15} /> {label}</button>;
}

/* ---------- product card ---------- */
function ProductCard({ item }) {
  const { go, addToCart } = useApp();
  const multi = !!(item.variants && item.variants.length > 1);
  return (
    <article className="pcard">
      <a className="pcard-img" href={'#p-' + item.id} onClick={(e) => { e.preventDefault(); go('product', { id: item.id }); }} aria-label={'View ' + item.name}>
        <Img k={item.imgs[0]} alt={item.name} />
        <span className="pcard-cat">{item.short || item.catLabel}</span>
      </a>
      <div className="pcard-body">
        <h3 className="pcard-name">{item.name}</h3>
        <div className="pcard-row">
          <Price value={item.price} />{multi && <span className="from">from</span>}
          <button className="add-sm" onClick={() => (multi ? go('product', { id: item.id }) : addToCart(item.id, null, 1))}
            aria-label={multi ? 'Choose size for ' + item.name : 'Add ' + item.name + ' to cart'}>
            <Icon n={multi ? 'arrow' : 'plus'} size={18} stroke={2.4} />
          </button>
        </div>
      </div>
    </article>
  );
}
