const token = getCookie("token");

async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/product`);
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        const responseData = await response.json();
        const products = responseData.products;
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

async function searchProducts(q, category="") {
    try {
        const response = await fetch(`${API_BASE_URL}/product?q=${q}&category_name=${category}`);
        if (!response.ok) {
            throw new Error("Failed to search products");
        }
        const responseData = await response.json();
        const products = responseData.products;
        return products;
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }

}

async function fetchProduct(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/product/${productId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch product");
        }
        const product = await response.json();
        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

async function updateProfile(profile) {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(profile),
        });
        if (!response.ok) {
            throw new Error("Failed to update profile");
        }
        const updatedProfile = await response.json();
        return updatedProfile;
    } catch (error) {
        console.error("Error updating profile:", error);
        return null;
    }
}

async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/category`);
        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

const fetchProfile = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }
        const profile = await response.json();
        return profile;
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

async function fetchMyOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/order`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch orders");
        }
        const orders = await response.json();
        return orders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}

async function addToCart(product) {
    try {
        const response = await fetch(`${API_BASE_URL}/cartitem`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "POST",
            body: JSON.stringify({
                productId: product.id,
                quantity: 1,
            }),
        });
        if (!response.ok) {
            throw new Error("Failed to Add To Cart");
        }
        const orders = await response.json();
        return orders;
    } catch (error) {
        console.error("Error Adding to Cart:", error);
        return [];
    }
}

async function getMyCart() {
try {
    const response = await fetch(`${API_BASE_URL}/cartitem`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET",
        
    });
    if (!response.ok) {
        throw new Error("Failed to Get CartItems");
    }
    const orders = await response.json();
    return orders;
} catch (error) {
    console.error("Error Getting CartItems:", error);
    return [];
}
}


async function makeOrder (product, delivery_address, delivery_contact, quantity) {
    try {
        const response = await fetch(`${API_BASE_URL}/order/${product.id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            method: "POST",
            body: JSON.stringify({
                quantity,
                delivery_address,
                delivery_contact,
                return_url: `${window.location.origin}/order-callback.html`,
                website_url: window.location.origin,
            }),
        });
        
        if (!response.ok) {
            throw new Error("Failed to Make Order");
        }
        const orderResponse = await response.json();
        return orderResponse;
    } catch (error) {
        console.error("Error Making Order:", error);
        return [];
    }
}