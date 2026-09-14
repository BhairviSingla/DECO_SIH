import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, CheckCircle2 } from "lucide-react";

const Cart = () => {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [orderPlaced, setOrderPlaced] = useState(false);

    // Fetch cart and products
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/cart")
            .then(res => res.json())
            .then(data => setCart(data))
            .catch(err => console.log(err));

        fetch("http://127.0.0.1:8000/api/marketplace")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.log(err));
    }, []);

    // Find product details
    const getProduct = (productId) => {
        return products.find(product => product.id === productId);
    };

    // Increase quantity
    const increaseQuantity = async (productId, currentQuantity) => {
        const newQuantity = currentQuantity + 1;

        const response = await fetch(
            "http://127.0.0.1:8000/api/cart/update",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId,
                    quantity: newQuantity
                })
            }
        );

        const data = await response.json();
        setCart(data.cart);
    };

    // Decrease quantity
    const decreaseQuantity = async (productId, currentQuantity) => {
        if (currentQuantity <= 1) return;

        const newQuantity = currentQuantity - 1;

        const response = await fetch(
            "http://127.0.0.1:8000/api/cart/update",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId,
                    quantity: newQuantity
                })
            }
        );

        const data = await response.json();
        setCart(data.cart);
    };

    // Remove item
    const removeItem = async (productId) => {
        const response = await fetch(
            `http://127.0.0.1:8000/api/cart/remove/${productId}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();
        setCart(data.cart);
    };

    // Calculate total
    const getPrice = (price) => {
        return Number(price.replace("₹", ""));
    };

    const total = cart.reduce((sum, item) => {
        const product = getProduct(item.productId);

        if (!product) return sum;

        return sum + getPrice(product.price) * item.quantity;
    }, 0);

    // Place order
    const placeOrder = async () => {
        const response = await fetch(
            "http://127.0.0.1:8000/api/orders/place",
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (response.ok) {
            setCart([]);
            setOrderPlaced(true);
        } else {
            alert(data.message);
        }
    };

    // ---------------- SUCCESS SCREEN ----------------

    if (orderPlaced) {
        return (
            <div style={styles.page}>
                <div style={styles.header}>
                    <button
                        onClick={() => navigate("/marketplace")}
                        style={styles.backButton}
                    >
                        <ArrowLeft size={25} />
                    </button>

                    <div>
                        <h1 style={styles.headerTitle}>Order Confirmed</h1>
                        <p style={styles.headerSubtitle}>
                            Your fish health products are on their way
                        </p>
                    </div>
                </div>

                <div style={styles.successContainer}>
                    <div style={styles.successCard}>
                        <div style={styles.successIcon}>
                            <CheckCircle2 size={55} />
                        </div>

                        <h2 style={styles.successTitle}>
                            Order placed successfully!
                        </h2>

                        <p style={styles.successText}>
                            Thank you for your order. Your verified fish
                            health products have been placed successfully.
                        </p>

                        <button
                            onClick={() => navigate("/marketplace")}
                            style={styles.primaryButton}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ---------------- CART SCREEN ----------------

    return (
        <div style={styles.page}>

            {/* HEADER */}
            <div style={styles.header}>

                <button
                    onClick={() => navigate("/marketplace")}
                    style={styles.backButton}
                >
                    <ArrowLeft size={25} />
                </button>

                <div>
                    <h1 style={styles.headerTitle}>Your Cart</h1>

                    <p style={styles.headerSubtitle}>
                        Review your selected products
                    </p>
                </div>

            </div>

            {/* MAIN CONTENT */}
            <div style={styles.content}>

                {cart.length === 0 ? (

                    <div style={styles.emptyCard}>

                        <div style={styles.emptyIcon}>
                            🛒
                        </div>

                        <h2 style={styles.emptyTitle}>
                            Your cart is empty
                        </h2>

                        <p style={styles.emptyText}>
                            Add verified fish health products from the
                            marketplace.
                        </p>

                        <button
                            onClick={() => navigate("/marketplace")}
                            style={styles.primaryButton}
                        >
                            Browse Products
                        </button>

                    </div>

                ) : (

                    <>

                        {/* CART TITLE */}
                        <div style={styles.sectionHeader}>
                            <h2 style={styles.sectionTitle}>
                                Selected products
                            </h2>

                            <span style={styles.itemCount}>
                                {cart.reduce(
                                    (total, item) => total + item.quantity,
                                    0
                                )}{" "}
                                items
                            </span>
                        </div>

                        {/* CART ITEMS */}
                        <div style={styles.itemsContainer}>

                            {cart.map(item => {

                                const product = getProduct(item.productId);

                                if (!product) return null;

                                return (
                                    <div
                                        key={item.productId}
                                        style={styles.productCard}
                                    >

                                        {/* PRODUCT IMAGE PLACEHOLDER */}
                                        <div style={styles.productImage}>
                                            <span>🐟</span>
                                        </div>

                                        {/* PRODUCT DETAILS */}
                                        <div style={styles.productDetails}>

                                            <div style={styles.tag}>
                                                {product.tag}
                                            </div>

                                            <h3 style={styles.productName}>
                                                {product.name}
                                            </h3>

                                            <p style={styles.productDescription}>
                                                {product.description}
                                            </p>

                                            <p style={styles.price}>
                                                {product.price}
                                            </p>

                                        </div>

                                        {/* CONTROLS */}
                                        <div style={styles.controls}>

                                            <div style={styles.quantityBox}>

                                                <button
                                                    onClick={() =>
                                                        decreaseQuantity(
                                                            item.productId,
                                                            item.quantity
                                                        )
                                                    }
                                                    style={styles.quantityButton}
                                                >
                                                    <Minus size={16} />
                                                </button>

                                                <span style={styles.quantity}>
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        increaseQuantity(
                                                            item.productId,
                                                            item.quantity
                                                        )
                                                    }
                                                    style={styles.quantityButton}
                                                >
                                                    <Plus size={16} />
                                                </button>

                                            </div>

                                            <button
                                                onClick={() =>
                                                    removeItem(item.productId)
                                                }
                                                style={styles.removeButton}
                                            >
                                                <Trash2 size={18} />
                                                Remove
                                            </button>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                        {/* ORDER SUMMARY */}
                        <div style={styles.summaryCard}>

                            <h2 style={styles.summaryTitle}>
                                Order summary
                            </h2>

                            <div style={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>₹{total}</span>
                            </div>

                            <div style={styles.summaryRow}>
                                <span>Delivery</span>
                                <span style={styles.freeText}>
                                    Free
                                </span>
                            </div>

                            <div style={styles.divider}></div>

                            <div style={styles.totalRow}>
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>

                            <button
                                onClick={placeOrder}
                                style={styles.primaryButton}
                            >
                                Place Order
                            </button>

                            <p style={styles.safetyText}>
                                ✓ Verified fish health products
                            </p>

                        </div>

                    </>
                )}

            </div>
        </div>
    );
};


// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles = {

    page: {
        minHeight: "100vh",
        background: "#E1F5F3",
        color: "#073B3A",
        fontFamily: "Inter, Arial, sans-serif"
    },

    // HEADER
    header: {
        height: "88px",
        background: "#FFFFFF",
        borderBottom: "1px solid #C9E5E2",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        padding: "0 28px",
        boxSizing: "border-box"
    },

    backButton: {
        width: "62px",
        height: "58px",
        border: "none",
        borderRadius: "18px",
        background: "#EFF8F7",
        color: "#05665F",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer"
    },

    headerTitle: {
        margin: 0,
        fontSize: "32px",
        fontWeight: "750",
        color: "#073B3A",
        lineHeight: "1.1"
    },

    headerSubtitle: {
        margin: "5px 0 0",
        fontSize: "18px",
        color: "#69817F"
    },

    // CONTENT
    content: {
        width: "min(925px, calc(100% - 40px))",
        margin: "0 auto",
        padding: "38px 0 60px"
    },

    sectionHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "18px"
    },

    sectionTitle: {
        margin: 0,
        fontSize: "25px",
        fontWeight: "750",
        color: "#073B3A"
    },

    itemCount: {
        color: "#6D8583",
        fontSize: "16px"
    },

    // PRODUCTS
    itemsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },

    productCard: {
        background: "#FFFFFF",
        border: "1px solid #C9E5E2",
        borderRadius: "20px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        boxSizing: "border-box"
    },

    productImage: {
        width: "110px",
        height: "110px",
        borderRadius: "18px",
        background: "#E8F6F4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "40px",
        flexShrink: 0
    },

    productDetails: {
        flex: 1,
        minWidth: 0
    },

    tag: {
        display: "inline-block",
        background: "#E3F3F0",
        color: "#087269",
        padding: "6px 11px",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: "700",
        marginBottom: "9px"
    },

    productName: {
        margin: "0 0 6px",
        fontSize: "21px",
        fontWeight: "750",
        color: "#073B3A"
    },

    productDescription: {
        margin: "0 0 9px",
        color: "#718381",
        fontSize: "14px",
        lineHeight: "1.4"
    },

    price: {
        margin: 0,
        fontSize: "18px",
        fontWeight: "750",
        color: "#05665F"
    },

    // QUANTITY
    controls: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "12px"
    },

    quantityBox: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #C9E5E2",
        borderRadius: "11px",
        overflow: "hidden",
        background: "#F8FCFC"
    },

    quantityButton: {
        width: "34px",
        height: "34px",
        border: "none",
        background: "transparent",
        color: "#05665F",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer"
    },

    quantity: {
        minWidth: "30px",
        textAlign: "center",
        fontSize: "15px",
        fontWeight: "700",
        color: "#073B3A"
    },

    removeButton: {
        border: "none",
        background: "transparent",
        color: "#7B9290",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        cursor: "pointer",
        fontSize: "13px"
    },

    // SUMMARY
    summaryCard: {
        marginTop: "22px",
        background: "#FFFFFF",
        border: "1px solid #C9E5E2",
        borderRadius: "20px",
        padding: "26px",
        boxSizing: "border-box"
    },

    summaryTitle: {
        margin: "0 0 20px",
        fontSize: "21px",
        fontWeight: "750",
        color: "#073B3A"
    },

    summaryRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "13px",
        fontSize: "16px",
        color: "#718381"
    },

    freeText: {
        color: "#087269",
        fontWeight: "700"
    },

    divider: {
        height: "1px",
        background: "#D7EAE8",
        margin: "18px 0"
    },

    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "22px",
        fontWeight: "800",
        color: "#073B3A",
        marginBottom: "20px"
    },

    primaryButton: {
        width: "100%",
        border: "none",
        borderRadius: "12px",
        padding: "14px 20px",
        background: "#05665F",
        color: "#FFFFFF",
        fontSize: "16px",
        fontWeight: "750",
        cursor: "pointer"
    },

    safetyText: {
        textAlign: "center",
        margin: "14px 0 0",
        fontSize: "13px",
        color: "#718381"
    },

    // EMPTY CART
    emptyCard: {
        background: "#FFFFFF",
        border: "1px solid #C9E5E2",
        borderRadius: "20px",
        padding: "60px 30px",
        textAlign: "center",
        marginTop: "20px"
    },

    emptyIcon: {
        width: "75px",
        height: "75px",
        margin: "0 auto 20px",
        borderRadius: "50%",
        background: "#E7F5F3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px"
    },

    emptyTitle: {
        margin: "0 0 8px",
        fontSize: "24px",
        color: "#073B3A"
    },

    emptyText: {
        color: "#718381",
        margin: "0 auto 25px",
        maxWidth: "420px",
        lineHeight: "1.5"
    },

    // SUCCESS
    successContainer: {
        width: "min(925px, calc(100% - 40px))",
        margin: "0 auto",
        paddingTop: "45px"
    },

    successCard: {
        background: "#FFFFFF",
        border: "1px solid #C9E5E2",
        borderRadius: "22px",
        padding: "60px 40px",
        textAlign: "center"
    },

    successIcon: {
        width: "85px",
        height: "85px",
        margin: "0 auto 22px",
        borderRadius: "50%",
        background: "#E5F5F1",
        color: "#087269",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    successTitle: {
        margin: "0 0 12px",
        fontSize: "27px",
        color: "#073B3A"
    },

    successText: {
        maxWidth: "520px",
        margin: "0 auto 28px",
        color: "#718381",
        lineHeight: "1.6"
    }
};

export default Cart;