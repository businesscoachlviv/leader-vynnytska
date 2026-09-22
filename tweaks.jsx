// Tweaks for "Мислення Лідера" landing page

const TWEAK_DEFAULTS = window.__TWEAK_DEFAULTS || {
  accentColor: "#FF6600",
  heroBackdrop: "photo",
  ctaLabel: "Реєструйся · 490 грн"
};

function applyAccent(hex) {
  if (!hex) return;
  document.documentElement.style.setProperty('--orange', hex);
  try {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    const dim = (c) => Math.max(0, Math.round(c * 0.85));
    const deep = '#' + [dim(r),dim(g),dim(b)].map(v=>v.toString(16).padStart(2,'0')).join('');
    document.documentElement.style.setProperty('--orange-deep', deep);
  } catch (e) {}
}

function applyHeroBackdrop(mode) {
  const bg = document.querySelector('.hero-bg');
  if (!bg) return;
  if (mode === 'pattern') {
    bg.style.backgroundImage = 'radial-gradient(900px 600px at 78% 18%, rgba(255,102,0,0.22), transparent 60%), radial-gradient(600px 500px at 12% 90%, rgba(255,102,0,0.12), transparent 65%)';
    bg.style.opacity = '1';
    bg.style.filter = 'none';
  } else if (mode === 'solid') {
    bg.style.backgroundImage = 'none';
    bg.style.background = '#000';
    bg.style.opacity = '1';
  } else {
    bg.style.backgroundImage = 'url("assets/hero-bg.jpg")';
    bg.style.backgroundSize = 'cover';
    bg.style.backgroundPosition = '75% center';
    bg.style.opacity = '1';
    bg.style.filter = 'contrast(1.02) saturate(1.05)';
  }
}

function applyHeadline(style) {
  const h1 = document.querySelector('.hero h1');
  if (!h1) return;
  if (style === 'oneline') {
    h1.innerHTML = '<span class="hero-title">МИСЛЕННЯ ЛІДЕРА</span><span class="hero-subtitle">від контролю до впливу</span>';
    h1.style.maxWidth = '18ch';
  } else if (style === 'punchy') {
    h1.innerHTML = '<span class="hero-title">ВІДПУСТИ КОНТРОЛЬ.</span><span class="hero-subtitle">Масштабуй бізнес без вигорання.</span>';
    h1.style.maxWidth = '16ch';
  } else {
    h1.innerHTML =
      '<span class="hero-title">МИСЛЕННЯ ЛІДЕРА:</span>' +
      '<span class="hero-subtitle">як відпустити контроль і масштабувати бізнес без вигорання</span>';
    h1.style.maxWidth = '18ch';
  }
}

function applyCtaLabel(label) {
  if (!label) return;
  document.querySelectorAll('a.btn, button.btn').forEach(b => {
    const txt = b.textContent.trim();
    // Match the primary registration CTAs (skip the "Хочу бонус" button)
    if (/Реєструйся|Зареєструватись/i.test(txt) && !/бонус|деталі/i.test(txt)) {
      b.innerHTML = label + ' <span class="arrow">→</span>';
    }
  });
}

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => { applyAccent(t.accentColor); }, [t.accentColor]);
  React.useEffect(() => { applyHeroBackdrop(t.heroBackdrop); }, [t.heroBackdrop]);
  React.useEffect(() => { applyCtaLabel(t.ctaLabel); }, [t.ctaLabel]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Бренд" />
      <TweakColor
        label="Акцент"
        value={t.accentColor}
        onChange={(v) => setTweak('accentColor', v)}
        options={['#FF6600', '#E63946', '#1F8A5B', '#2A6FDB']}
      />

      <TweakSection label="Hero" />
      <TweakRadio
        label="Фон"
        value={t.heroBackdrop}
        onChange={(v) => setTweak('heroBackdrop', v)}
        options={[
          { value: 'photo',   label: 'Фото' },
          { value: 'pattern', label: 'Патерн' },
          { value: 'solid',   label: 'Чорний' },
        ]}
      />

      <TweakSection label="CTA" />
      <TweakText
        label="Текст кнопки"
        value={t.ctaLabel}
        onChange={(v) => setTweak('ctaLabel', v)}
      />
    </TweaksPanel>
  );
}

// Mount when the panel lib (loaded via Babel) is available
(function mount() {
  if (typeof useTweaks === 'undefined' || typeof TweaksPanel === 'undefined') {
    setTimeout(mount, 60);
    return;
  }
  const host = document.getElementById('tweaks-root');
  if (!host) return;
  ReactDOM.createRoot(host).render(<TweaksApp />);
})();
