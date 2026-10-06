import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const API_URL = process.env.REACT_APP_API_URL;

// Exact required category order
const CATEGORY_ORDER = [
  'Starter',
  'Veg',
  'Non-Veg',
  'Fast Food',
  'Pizza',
  'Burger',
  'Chowmein',
  'Desserts',
  'Drinks',
];

// Category emoji for visual accent
const CATEGORY_ICONS = {
  Starter: '🥗',
  Veg: '🥦',
  'Non-Veg': '🍗',
  'Fast Food': '🍟',
  Pizza: '🍕',
  Burger: '🍔',
  Chowmein: '🍜',
  Desserts: '🍰',
  Drinks: '🥤',
};

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState('');

  const loadFoodItems = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/foodData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setFoodItems(data[0] || []);

      // Sort categories strictly according to CATEGORY_ORDER
      const fetchedCats = data[1] || [];
      fetchedCats.sort((a, b) => {
        const indexA = CATEGORY_ORDER.indexOf(a.CategoryName);
        const indexB = CATEGORY_ORDER.indexOf(b.CategoryName);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });

      setFoodCat(fetchedCats);
    } catch (err) {
      console.error('Failed to load food data:', err.message);
    }
  };

  useEffect(() => {
    loadFoodItems();
  }, []);

  // Total matching items count for global search feedback
  const totalMatchingItems = foodItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  ).length;

  return (
    <div className="af-page-bg">
      <Navbar />

      {/* ── Hero Carousel ─────────────────────────────────────────────── */}
      <section className="af-hero">
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade af-hero"
          data-bs-ride="carousel"
          data-bs-interval="4500"
        >
          {/* Hero content overlay */}
          <div className="af-hero-content">
            <div className="af-hero-badge">
              <span>⭐</span> Premium Food Delivery
            </div>
            <h1 className="af-hero-title">
              Good Food.<br />
              <span>Great Moments.</span>
            </h1>
            <p className="af-hero-sub">
              Fresh ingredients, bold flavors — delivered fast to your door.
            </p>

            {/* Search bar */}
            <div className="af-search-wrap">
              <div className="af-search-box">
                {/* Search icon SVG */}
                <svg
                  className="af-search-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  className="af-search-input form-control"
                  type="search"
                  placeholder="Search pizza, burger, paneer, chowmein..."
                  aria-label="Search food"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {search && (
                <button
                  className="af-search-clear btn"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          {/* Carousel slides */}
          <div className="carousel-inner" style={{ height: '100%' }}>
            <div className="carousel-item active" style={{ height: '100%' }}>
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&auto=format&fit=crop&q=80"
                className="af-hero-img d-block w-100"
                style={{ height: '620px' }}
                alt="Juicy Burger"
              />
            </div>
            <div className="carousel-item" style={{ height: '100%' }}>
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80"
                className="af-hero-img d-block w-100"
                style={{ height: '620px' }}
                alt="Woodfired Pizza"
              />
            </div>
            <div className="carousel-item" style={{ height: '100%' }}>
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80"
                className="af-hero-img d-block w-100"
                style={{ height: '620px' }}
                alt="Sizzling Barbeque"
              />
            </div>
          </div>

          {/* Carousel controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="prev"
            style={{ zIndex: 3 }}
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="next"
            style={{ zIndex: 3 }}
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* ── Food categories & items ──────────────────────────────────── */}
      <main className="af-main">
        <div className="container af-categories-section">
          {totalMatchingItems === 0 && search !== '' ? (
            <div className="af-empty-state">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3>No results for &ldquo;{search}&rdquo;</h3>
              <p>Try a different name — e.g. pizza, burger, paneer, chowmein.</p>
              <button
                className="btn af-nav-btn af-nav-btn-solid mt-3"
                onClick={() => setSearch('')}
              >
                Clear Search
              </button>
            </div>
          ) : (
            foodCat.map((cat) => {
              const filtered = foodItems.filter(
                (item) =>
                  item.CategoryName === cat.CategoryName &&
                  item.name.toLowerCase().includes(search.toLowerCase())
              );

              // If searching, hide categories that have 0 matching items
              if (search !== '' && filtered.length === 0) return null;

              const icon = CATEGORY_ICONS[cat.CategoryName] || '🍽️';

              return (
                <div key={cat._id || cat.CategoryName} className="mb-5">
                  {/* Category heading */}
                  <div className="af-cat-heading mb-1">
                    <span className="af-cat-heading-dot"></span>
                    <span style={{ fontSize: '1.1rem', marginRight: '6px' }}>{icon}</span>
                    {cat.CategoryName}
                    <span className="af-category-chip">{filtered.length}</span>
                  </div>
                  <hr className="af-cat-divider" />

                  {/* Cards */}
                  {filtered.length > 0 ? (
                    <div className="af-cards-row">
                      {filtered.map((filterItem) => (
                        <Card
                          key={filterItem._id}
                          foodName={filterItem.name}
                          item={filterItem}
                          options={filterItem.options[0]}
                          ImgSrc={filterItem.img}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="af-footer-tagline ms-1">No items in this category.</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
