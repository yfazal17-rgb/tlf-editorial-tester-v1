// Continuous horizontal marquee at the top of the page.
// Edit TICKER_ITEMS to change what the ticker says.
'use client';

const TICKER_ITEMS = [
  'TheLifeFolder', '✦', 'Archive', '✦', 'Est. 2024', '✦',
  'Everything That Matters, Filed', '✦', 'Vintage', '✦', 'Culture', '✦', 'Craft', '✦',
];

export default function Ticker() {
  // Doubled for seamless infinite loop
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {doubled.map((item, i) =>
          item === '✦' ? (
            <span className="dot" key={i}>✦</span>
          ) : (
            <span key={i}>{item}</span>
          )
        )}
      </div>
    </div>
  );
}
