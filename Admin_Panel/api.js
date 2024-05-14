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


async function downloadAnalytics() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/download`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to download analytics");
        }
        const responseData = await response.json();
        return responseData.url;
    } catch (error) {
        console.error("Error downloading analytics:", error);
        return null;
    }

}

async function fetchAnalytics() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch analytics");
        }
        const analytics = await response.json();
        return analytics;
    } catch (error) {
        console.error("Error fetching analytics:", error);
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


async function addCategory(name, image) {
    try {
        const response = await fetch(`${API_BASE_URL}/category`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ category_name: name, image }),
        });
        if (!response.ok) {
            throw new Error("Failed to add category");
        }
        const category = await response.json();
        return category;
    } catch (error) {
        console.error("Error adding category:", error);
        return null;
    }
}


async function deleteCategory(id) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/category/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to delete category");
        }
        return true;
    } catch (error) {
        console.error("Error deleting category:", error);
        return false;
    }
}

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

async function addProduct(product) {
    try {
        const response = await fetch(`${API_BASE_URL}/product`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(product),
        });
        if (!response.ok) {
            throw new Error("Failed to add product");
        }
        const addedProduct = await response.json();
        return addedProduct;
    } catch (error) {
        console.error("Error adding product:", error);
        return null;
    }
}


async function deleteProduct(productId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/product/${productId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to delete product");
        }
        return true;
    } catch (error) {
        console.error("Error deleting product:", error);
        return false;
    }
}


const updateProduct = async (product) => {
    try {
        const response = await fetch(`${API_BASE_URL}/product/${product.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                product_name: product.name,
                product_price: parseFloat(product.price),
                product_description: product.description,
                category_id: parseInt(product.category),
            }),
        });
        if (!response.ok) {
            throw new Error("Failed to update product");
        }
        const updatedProduct = await response.json();
        return updatedProduct;
    } catch (error) {
        console.error("Error updating product:", error);
        return null;
    }
}

const addProductImage = async (productId, imageURL) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/product/image/add`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    product_id: productId,
                    url: imageURL,
                }),
            }
        );
        if (!response.ok) {
            throw new Error("Failed to add product image");
        }
        const responseData = await response.json();
        return responseData.image;
    } catch (error) {
        console.error("Error adding product image:", error);
        return null;
    }
}

const deleteProductImage = async (imageID) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/product/image/${imageID}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to delete product image");
        }
        return true;
    } catch (error) {
        console.error("Error deleting product image:", error);
        return false;
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

async function fetchAllOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/order/all`, {
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


async function updateOrder(orderId, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/order/${orderId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                order_status: status,
            }),
        });
        if (!response.ok) {
            return false;
        }
        const updatedOrder = await response.json();
        return updatedOrder;
    } catch (error) {
        console.error("Error updating order:", error);
        return null;
    }
}