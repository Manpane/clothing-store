const token = getCookie("token");

if (token.length === 0) {
  window.location.href = "/login.html";
}

const sideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

init();

function openProfileModal() {
  const modalContainer = document.getElementById('update-profile-modal');
  modalContainer.style.display = 'block';
  let profilePictureUrl = window.PROFILE?.profilePicture?.trim();
  if (!profilePictureUrl) {
    profilePictureUrl = "Images/user-avatar.png";
  }
  console.log("Profile from open modal fnction: "+{...window.PROFILE});
  modalContainer.innerHTML = `
  <div class="profile-modal-content">
          <span class="profile-close" onclick="closeProfileModal()">&times;</span>
          <h2>Update Profile</h2>
          <form id="update-profile-form">
            <br>
            <label for="profile-picture">Profile Picture:</label>
            <div style="display: flex; align-items: center; justify-content: center;flex-direction: column; position: relative;">
              <input type="file" id="update-profile-picture-input" name="profilePicture" style="opacity: 0; width:70px;height: 100%;position: absolute; cursor: pointer;">
              <img style="width: 100px; border-radius: 50%;" id="update-profile-preview" src="${profilePictureUrl.startsWith("/files") ? API_BASE_URL+profilePictureUrl : profilePictureUrl}">
            </div>
            <br>
            <label for="profile-username">Username:</label>
            <input type="text" id="profile-username" name="username" value="${window.PROFILE?.username}" placeholder="Username">
            <label for="profile-contact">Contact:</label>
            <input type="text" id="profile-contact" name="contact" value="${window.PROFILE?.contact ?? ""}" placeholder="Contact">
            <label for="profile-address">Address:</label>
            <textarea id="profile-address" name="address" placeholder="Address">${window.PROFILE?.address ?? ""}</textarea>
            <input type="submit" value="Update">
          </form>
      </div>
  `;

  document.getElementById('update-profile-form').addEventListener('submit', function (event) {
    event.preventDefault();
  
    closeProfileModal();
  });
  
  
  document.getElementById("update-profile-picture-input").addEventListener("change", function () {
    const imageFile = this.files[0];
    const imagePreview = document.getElementById("update-profile-preview");
    imagePreview.src = URL.createObjectURL(imageFile);
    imagePreview.style.display = "block";
  });
  
  document.getElementById('update-profile-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const imageFile = formData.get("profilePicture");
    if (imageFile) {
      const imageUrl = await uploadImage(imageFile);
      if (imageUrl) {
        formData.set("profilePicture", imageUrl);
      }
    }
    const profile = {
      username: formData.get("username"),
      contact: formData.get("contact"),
      address: formData.get("address"),
      profilePicture: formData.get("profilePicture") ?? undefined,
    };
    const updatedProfile = await updateProfile(profile);
    if (updatedProfile) {
      showSuccess("Profile updated successfully");
      loadProfile();
      closeProfileModal();
    } else {
      showError("Failed to update profile");
    }
  });
}

function closeProfileModal() {
  document.getElementById('update-profile-modal').style.display = 'none';
}


function init() {
  sideMenu.forEach((item) => {
    const li = item.parentElement;

    item?.addEventListener("click", function () {
      sideMenu.forEach((i) => {
        i.parentElement.classList.remove("active");
      });
      li.classList.add("active");
    });
  });

  menuBar?.addEventListener("click", function () {
    sidebar.classList.toggle("hide");
  });

  document.getElementById("verify-email-button")?.addEventListener("click", async function () {
    window.location.href = `/otp.html?email=${window.PROFILE?.email ?? ""}`;
  });

  document.getElementById("create-category-opener")?.addEventListener("click", function () {
    document.querySelector(".category-form-wrapper").classList.remove("hidden");
  });

  document.getElementById("test-result")?.addEventListener("keyup", function () {
    newCategory.image = this.value;
  });

  document.getElementById("test-name")?.addEventListener("change", function () {
    newCategory.name = this.value;
  });

  document.getElementById("logout-button")?.addEventListener("click", function () {
    logout();
  });

  loadCategories();
  loadProfile();
  loadAnalytics();
}

async function loadAnalytics() {
  const analytics = await fetchAnalytics();
  document.getElementById("pending-orders-data-value").textContent = analytics.pendingOrders;
  document.getElementById("total-sales-data-value").textContent = analytics.totalSales;
  document.getElementById("total-orders-data-value").textContent = analytics.totalOrders;
  document.getElementById("download-analytics-button")?.addEventListener("click", async function (e) {
    e.preventDefault();
    const url = await downloadAnalytics();
    if (url) {
      window.open(`${API_BASE_URL}${url}`, "_blank");
    } else {
      showError("Failed to download analytics");
    }
  });
  // return;
  let myChart = document.getElementById("myChart").getContext("2d");
  let popChart = new Chart(myChart, {
    type: "bar",
    data: {
      labels: Object.keys(analytics.history),
      datasets: [
        {
          label: "Order Details",
          data: Object.values(analytics.history),
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(153, 102, 255)",
            "rgb(255, 159, 64)",
            "rgb(255, 0, 0)",
            "rgb(0, 255, 0)",
            "rgb(0, 0, 255)",
            "rgb(255, 255, 0)",
            "rgb(255, 0, 255)",
          ].slice(0, Object.keys(analytics.history).length)
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Orders Detail",
        fontSize: 20,
      },

      legend: {
        display: true,
        labels: {
          fontColor: "#000",
        },
      },
    },
    tooltips: {
      enabled: true,
    },
  });

}

document.getElementById("category_image_input")?.addEventListener("change", function () {
  const imageFile = this.files[0];
  const imagePreview = document.getElementById("upload-category-image");
  imagePreview.src = URL.createObjectURL(imageFile);
  imagePreview.style.display = "block";
});

document.getElementById("addCategoryButton")?.addEventListener("click", async function () {
  const categoryName = document.getElementById("category_name_input").value.trim();
  console.log(categoryName);
  if (!categoryName) {
    return;
  }
  const imageFile = document.getElementById("category_image_input").files[0] ?? null;
  const newCategory = { category_name: categoryName };
  if (imageFile) {
    const imageUrl = await uploadImage(imageFile);
    if (imageUrl) {
      newCategory.image = imageUrl;
    }
  }
  console.log(newCategory);
  const savedCategory = await addCategory(newCategory.category_name, newCategory.image);
  if (savedCategory) {
    showSuccess("Category added successfully");
    loadCategories();
    document.getElementById("category_name_input").value = "";
    document.getElementById("upload-category-image").style.display = "none";
    document.getElementById("category_image_input").value = [];
  }
});


async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  try {
    const response = await fetch(`${API_BASE_URL}/file`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to upload image");
    }
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

async function loadCategories() {
  clearCategoryTable();
  const categories = await fetchCategories();
  let options = "";
  categories.forEach((category) => {
    addCategoryRow(category);
    options += `\n<option value="${category.id}">${category.category_name}</option>`;
  });
  document.getElementById("choose-cat").innerHTML = options;
}

function clearCategoryTable() {
  const categoryTable = document.getElementById("category-table");
  categoryTable.innerHTML = "";
}

function addCategoryRow(category) {
  console.log(category)
  const testsTable = document.getElementById("category-table");
  const row = document.createElement("tr");
  row.id = `category-row-${category.id}`;
  row.innerHTML = `
    <td>${category.category_name}</td>
    <td><img src="${API_BASE_URL}${category.image}" alt="${category.category_name}" style="max-width: 100px;"></td>
    <td>
      <button class="delete-btn"><i class='bx bxs-trash' ></i></button>
    </td>
  `;
  testsTable.appendChild(row);

  const deleteBtn = row.querySelector(".delete-btn");

  deleteBtn?.addEventListener("click", () => deleteCategoryRow(category.id));
}

async function deleteCategoryRow(categoryId) {
  const success = await deleteCategory(categoryId);
  if (success) {
    showSuccess("Category deleted successfully");
    loadCategories();
  } else {
    showError("Failed to delete category");
  }
}


document.getElementById("prod-img")?.addEventListener("change", function () {
  const imagePreviewDiv = document.getElementById("preview-images");
  let images = "";
  const files = this.files;

  Object.keys(this.files).forEach(index => {
    const file = files[index];
    images += `\n<img alt="product-image" src="${URL.createObjectURL(file)}" style="width: 70px;">`;
  });
  console.log(images);
  imagePreviewDiv.innerHTML = images;
  imagePreviewDiv.style.display = "flex";
});

function openEditProductModal() {
  document.getElementById('editProductModal').style.display = 'block';
}

function closeEditProductModal() {
  populateProducts();
  document.getElementById('editProductModal').style.display = 'none';
}

async function populateEditProductModal(product) {
  document.getElementById('editProductModal').innerHTML =
    `
  <div class="modal-content">
        <span class="close" onclick="closeEditProductModal()">&times;</span>
        <h2>Edit Product</h2>
        <form id="editProductForm">
          <div class="form-group">
            <label for="editProductName">Name:</label>
            <input
              type="text"
              id="editProductName"
              name="editProductName"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label for="editProductImages">Images:</label>
            <div id="editProductImages" class="image-container"></div>
            <input type="file" id="editProductAddImageInput" multiple>
          </div>
          <div class="form-group">
            <label for="editProductCategory">Category:</label>
            <select class="form-input" id="edit-prod-choose-cat"></select>
          </div>
          <div class="form-group">
            <label for="editProductPrice">Price:</label>
            <input
              type="text"
              id="editProductPrice"
              name="editProductPrice"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label for="editProductDescription">Description:</label>
            <textarea
              id="editProductDescription"
              name="editProductDescription"
              class="form-control"
              required
            ></textarea>
          </div>
          <div class="button-group">
            <button
              type="button"
              id="deleteProductButton"
              class="btn btn-danger"
            >
              Delete
            </button>
            <input type="submit" value="Save" class="btn btn-primary" id="edit-product-save-button"/>
          </div>
        </form>
      </div>
  `;
  document.getElementById('editProductName').value = product.product_name;
  document.getElementById('editProductPrice').value = product.product_price;
  document.getElementById('editProductDescription').value = product.product_description;
  document.getElementById('edit-product-save-button').addEventListener('click', async function (e) {
    e.preventDefault();
    const updatedProduct = {
      id: product.id,
      name: document.getElementById('editProductName')?.value,
      price: parseFloat(document.getElementById('editProductPrice')?.value),
      description: document.getElementById('editProductDescription')?.value,
      category: parseInt(document.getElementById('edit-prod-choose-cat')?.value),
    };
    console.log(updatedProduct);
    const success = await updateProduct(updatedProduct);
    if (success) {
      showSuccess("Product updated successfully");
      closeEditProductModal();
    } else {
      showError("Failed to update product");
    }
  });
  document.getElementById('deleteProductButton').addEventListener('click', async function () {
    const success = await deleteProduct(product.id);
    if (success) {
      showSuccess("Product deleted successfully");
      closeEditProductModal();
      populateProducts();
    } else {
      showError("Failed to delete product");
    }
  });
  const category_list = document.getElementById("edit-prod-choose-cat");
  category_list.innerHTML = `<option value="${product.category.id}">${product.category.category_name}</option>`;
  const categories = await fetchCategories();
  if (categories) {
    categories.forEach((category) => {
      if (category.id === product.category.id) return;
      category_list.innerHTML += `<option value="${category.id}">${category.category_name}</option>`;
    });
  }
  // images of the product loaded into the editPro ductImages div
  // each image when hovered over should have a delete button
  document.getElementById('editProductImages').innerHTML = "";
  product.images.forEach(image => {
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("edit-product-image");

    const deleteImageButton = document.createElement("button");
    deleteImageButton.classList.add("delete-image-btn");
    deleteImageButton.innerHTML = `<i class='bx bxs-trash' ></i>`;
    deleteImageButton.id = `edit-prod-image-id-${image.id}`;

    imageDiv.innerHTML = `
        <img src="${API_BASE_URL}/${image.url}" alt="${product.product_name}" style="max-width: 100px;">
      `;
    imageDiv.appendChild(deleteImageButton);

    deleteImageButton.addEventListener("click", async (e) => {
      e.preventDefault();
      await deleteProductImage(image.id);
      const prd = await fetchProduct(product.id);
      await populateEditProductModal(prd);
    });

    imageDiv.style.position = "relative";
    imageDiv.querySelector(".delete-image-btn").style.position = "absolute";
    imageDiv.querySelector(".delete-image-btn").style.top = "0";
    imageDiv.querySelector(".delete-image-btn").style.right = "0";

    document.getElementById('editProductImages').appendChild(imageDiv);
  });

  document.getElementById('editProductAddImageInput')?.addEventListener("change", async function () {
    const imageFiles = this.files;
    let images = await Promise.all(Object.keys(imageFiles).map(index => {
      let file = imageFiles[index];
      return uploadImage(file);
    }));
    images = images.filter(img => img);
    await Promise.all(images.map(img => addProductImage(product.id, img)));
    let prd = await fetchProduct(product.id);
    if (prd) {
      product.images = prd.images;
    }
    await populateEditProductModal(prd);
  });
}

async function addProductRow(product) {
  const productsTable = document.getElementById("prods-table");
  const prodRow = document.createElement("tr");
  prodRow.id = `product-row-${product.id}`;
  let imageUrl = product.images[0]?.url;

  if (product.images.length === 0) {
    imageUrl = "Images/image-placeholder.webp";
  }

  if (imageUrl.startsWith("/files")) {
    imageUrl = API_BASE_URL + imageUrl;
  }

  prodRow.innerHTML = `
    <td>${product.product_name}</td>
    <td>${product.category.category_name}</td>
    <td>RS ${product.product_price}</td>
    <td>${product.product_description}</td>
    <td><img src="${imageUrl}" alt="${product.product_name}" style="max-width: 100px;"></td>
    <td>
      <button id="edit-prod-${product.id}" class="edit-prod-btn"><i class="bx bx-edit-alt"></i></button>
    </td>
  `;
  productsTable.appendChild(prodRow);

  const editProdBtn = document.getElementById(`edit-prod-${product.id}`);

  editProdBtn?.addEventListener("click", async () => {
    await populateEditProductModal(product);
    openEditProductModal();
  }
  );
}

function editProductRow(
  row,
  nameSpan,
  categorySpan,
  priceSpan,
  descriptionSpan,
  imageSpan
) {
  row.classList.add("editing");
  nameSpan.contentEditable = true;
  categorySpan.contentEditable = true;
  priceSpan.contentEditable = true;
  descriptionSpan.contentEditable = true;
  imageSpan.contentEditable = true;
  row.querySelector(".edit-prod-btn").classList.add("prod-hidden");
  row.querySelector(".save-prod-btn").classList.remove("prod-hidden");
  row.querySelector(".delete-prod-btn").classList.add("prod-hidden");
  row.querySelector(".cancel-prod-btn").classList.remove("prod-hidden");
}


document.getElementById("add-prod")?.addEventListener("click", function () {
  document.querySelector(".prod-form-wrap").classList.remove("prod-hidden");
});


document.getElementById("create-prod")?.addEventListener("click", async function () {
  const imagePreviewDiv = document.getElementById("preview-images");
  const imageFiles = document.getElementById("prod-img")?.files || [];

  console.log(imageFiles)
  const images = (await Promise.all(Object.keys(imageFiles).map(function (index) {
    const file = imageFiles[index];
    return uploadImage(file);
  }))).map(url => url);

  let newProduct = {
    product_name: document.getElementById("prod-name").value,
    product_price: parseFloat(document.getElementById("prod-price").value),
    product_description: document.getElementById("prod-desc").value,
    product_images: images,
    category_id: parseInt(document.getElementById("choose-cat").value),
  };

  const savedProduct = await addProduct(newProduct);

  if (savedProduct?.id) {
    document.getElementById("prod-name").value = "";
    document.getElementById("choose-cat").value = "";
    document.getElementById("prod-price").value = "";
    document.getElementById("prod-desc").value = "";
    document.getElementById("prod-img").value = [];
    imagePreviewDiv.innerHTML = "";
    imagePreviewDiv.style.display = "none";
    document.querySelector(".prod-form-wrap").classList.add("prod-hidden");
    populateProducts();
    showSuccess("Successfully added product!");
  } else {
    showError("Product couldn't be added!");
  }

});

async function populateProducts() {
  try {
    console.log("Populating products");
    console.log(window.PROFILE);
    document.getElementById("prods-table").innerHTML = "";
    const products = await fetchProducts();
    products.forEach((product) => {
      if (product.admin_id === window.PROFILE?.id) {
        addProductRow(product);
      }
    });
  } catch (error) {
    console.error("Error populating products:", error);
  }
}

async function loadProfile() {
  try {
    window.PROFILE = (await fetchProfile())?.profile;
    console.log("PRofile loaded: ", window.PROFILE);
    if (!window.PROFILE) {
      logout();
    }
    if (window.PROFILE?.role?.toLowerCase().trim() === "super_admin") {
      window.location.href = "/admin.html";
    }
    if (!window.PROFILE?.emailVerified) {
      document.querySelector(".email-verify").style.display = "flex";
    } else {
      document.querySelector(".email-verify").style.display = "none";
    }

    const adminProfile = document.querySelector("#top-nav .profile");
    adminProfile.innerHTML = "";

    const adminImg = document.createElement("img");

    let profileImageUrl = window.PROFILE?.profilePicture?.trim();

    if (!profileImageUrl) {
      profileImageUrl = "Images/user-avatar.png";
    } else{
      if (profileImageUrl.startsWith("/files")) {
        profileImageUrl = API_BASE_URL + profileImageUrl;
      }
    }

    adminImg.src = profileImageUrl;
    adminImg.alt = window.PROFILE?.username || "Profile Picture";

    const adminRole = document.createElement("span");
    adminRole.classList.add("admin-role");

    const adminName = document.createElement("h4");
    adminName.textContent = window.PROFILE?.username || "Unknown";

    const adminDesc = document.createElement("p");
    adminDesc.textContent = window.PROFILE?.role || "admin";

    adminRole.appendChild(adminName);
    adminRole.appendChild(adminDesc);

    adminProfile.appendChild(adminImg);
    adminProfile.appendChild(adminRole);
    populateProducts();

  } catch (error) {
    console.error("Error fetching profile:", error);
  }
}