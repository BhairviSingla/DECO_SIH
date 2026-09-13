import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  ShoppingCart,
  ShieldCheck,
  Star,
  CheckCircle2,
  Package,
} from "lucide-react";

function Marketplace() {
  const navigate = useNavigate();
  const [added, setAdded] = useState(null);

  const treatments = [
    {
      id: 1,
      name: "AquaShield Bacterial Care",
      description: "Water-safe treatment for bacterial infections",
      price: "₹499",
      rating: "4.8",
      tag: "AI Recommended",
    },
    {
      id: 2,
      name: "FishGuard Pro",
      description: "Broad-spectrum fish health treatment",
      price: "₹649",
      rating: "4.7",
      tag: "Verified",
    },
    {
      id: 3,
      name: "AquaCare Water Treatment",
      description: "Helps maintain healthy tank conditions",
      price: "₹399",
      rating: "4.6",
      tag: "Popular",
    },
  ];

  const handleAdd = (id) => {
    setAdded(id);

    setTimeout(() => {
      setAdded(null);
    }, 1800);
  };

  return (
    <div className="marketplace-page">
      {/* Header */}
      <header className="marketplace-header">
        <button
          className="back-button"
          onClick={() => navigate("/disease")}
        >
          <ArrowLeft size={21} />
        </button>

        <div className="marketplace-title">
          <h1>Marketplace</h1>
          <p>Verified fish health products</p>
        </div>

        <button className="cart-button">
          <ShoppingCart size={21} />
          <span>2</span>
        </button>
      </header>

      <main className="marketplace-content">

        {/* AI Recommendation */}
        <section className="marketplace-ai-card">
          <div className="ai-card-top">
            <div className="ai-badge">
              <ShieldCheck size={18} />
            </div>

            <div>
              <span>DECO AI RECOMMENDED</span>
              <h2>Treatment for Bacterial Infection</h2>
            </div>
          </div>

          <p>
            Based on the fish health analysis, these verified products may
            help manage the detected condition.
          </p>
        </section>

        {/* Search */}
        <div className="marketplace-search">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search treatments and products"
          />
        </div>

        {/* Categories */}
        <div className="marketplace-categories">
          <button className="category-active">Recommended</button>
          <button>Water Care</button>
          <button>Fish Health</button>
        </div>

        {/* Products */}
        <section className="products-section">
          <div className="products-heading">
            <h2>Recommended products</h2>
            <span>3 products</span>
          </div>

          {treatments.map((product) => (
            <div className="product-card" key={product.id}>

              <div className="product-image">
                <Package size={38} />
              </div>

              <div className="product-details">
                <div className="product-tag">
                  {product.tag}
                </div>

                <h3>{product.name}</h3>

                <p>{product.description}</p>

                <div className="product-rating">
                  <Star size={14} fill="currentColor" />
                  <span>{product.rating}</span>
                  <span className="verified-text">
                    <ShieldCheck size={13} />
                    Verified seller
                  </span>
                </div>

                <div className="product-bottom">
                  <strong>{product.price}</strong>

                  <button
                    className="add-cart-button"
                    onClick={() => handleAdd(product.id)}
                  >
                    {added === product.id ? (
                      <>
                        <CheckCircle2 size={16} />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Safety Notice */}
        <section className="marketplace-safety">
          <ShieldCheck size={20} />

          <div>
            <h3>Verified products only</h3>
            <p>
              DECO recommends products from verified sellers. Always follow
              the product instructions and recommended dosage.
            </p>
          </div>
        </section>

      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button onClick={() => navigate("/dashboard")}>
          <span>⌂</span>
          Home
        </button>

        <button onClick={() => navigate("/analysis")}>
          <span>◉</span>
          Analysis
        </button>

        <button onClick={() => navigate("/disease")}>
          <span>✦</span>
          Disease
        </button>

        <button onClick={() => navigate("/aquabot")}>
          <span>◌</span>
          AquaBot
        </button>

        <button onClick={() => navigate("/profile")}>
          <span>○</span>
          Profile
        </button>
      </nav>
    </div>
  );
}

export default Marketplace;