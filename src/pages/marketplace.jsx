import React, { useEffect, useState } from "react";
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
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  // Fetch marketplace products
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/marketplace")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch marketplace products");
        }

        return response.json();
      })
      .then((data) => {
        setTreatments(data);
      })
      .catch((error) => {
        console.error("Marketplace error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Fetch current cart
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/cart")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }

        return response.json();
      })
      .then((data) => {
        const totalQuantity = data.reduce(
          (total, item) => total + item.quantity,
          0
        );

        setCartCount(totalQuantity);
      })
      .catch((error) => {
        console.error("Cart error:", error);
      });
  }, []);

  // Add product to cart
  const handleAdd = async (id) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add product to cart");
      }

      const data = await response.json();

      console.log("Cart updated:", data);

      // Update cart count
      const totalQuantity = data.cart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount(totalQuantity);

      // Show "Added"
      setAdded(id);

      setTimeout(() => {
        setAdded(null);
      }, 1800);
    } catch (error) {
      console.error("Add to cart error:", error);
    }
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

        {/* Cart Button */}
        <button
          className="cart-button"
          onClick={() => navigate("/cart")}
        >
          <ShoppingCart size={21} />
          <span>{cartCount}</span>
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

          <button className="category-active">
            Recommended
          </button>

          <button>
            Water Care
          </button>

          <button>
            Fish Health
          </button>

        </div>

        {/* Products */}
        <section className="products-section">

          <div className="products-heading">

            <h2>Recommended products</h2>

            <span>
              {treatments.length} products
            </span>

          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : (
            treatments.map((product) => (

              <div
                className="product-card"
                key={product.id}
              >

                <div className="product-image">
                  <Package size={38} />
                </div>

                <div className="product-details">

                  <div className="product-tag">
                    {product.tag}
                  </div>

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    {product.description}
                  </p>

                  <div className="product-rating">

                    <Star
                      size={14}
                      fill="currentColor"
                    />

                    <span>
                      {product.rating}
                    </span>

                    <span className="verified-text">

                      <ShieldCheck size={13} />

                      Verified seller

                    </span>

                  </div>

                  <div className="product-bottom">

                    <strong>
                      {product.price}
                    </strong>

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

            ))
          )}

        </section>

        {/* Safety Notice */}
        <section className="marketplace-safety">

          <ShieldCheck size={20} />

          <div>

            <h3>
              Verified products only
            </h3>

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