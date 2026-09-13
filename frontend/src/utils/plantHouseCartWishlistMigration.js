const CLEANUP_KEY = "plantHouseCartWishlistCleanupV1";
const ACTIVE_CART_KEY = "cartItem";
const ACTIVE_WISHLIST_KEY = "wishlistItems";

const legacyStorageKeys = [
  "cart",
  "cartItems",
  "mobileCart",
  "mobileWishlist",
  "wishlist",
  "favorites",
  "favourites",
  "savedItems",
];

const legacyMobileText = /iphone|ipad|samsung|oneplus|oppo|vivo|xiaomi|redmi|realme|motorola|nokia|iqoo|z10lite|mi\s*11x|charger|mobile\s*case|earphones?|smartphone|phone\s*accessor/i;

const parseArray = (key) => {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const isLegacyMobileItem = (item) => {
  if (!item || typeof item !== "object") return true;
  return [item.name, item.category, item.brand, item.productName]
    .filter(Boolean)
    .some((value) => legacyMobileText.test(String(value)));
};

export const runPlantHouseCartWishlistMigration = () => {
  if (typeof window === "undefined" || window.localStorage.getItem(CLEANUP_KEY)) return;

  const cartItems = parseArray(ACTIVE_CART_KEY).filter((item) => !isLegacyMobileItem(item));
  const wishlistItems = parseArray(ACTIVE_WISHLIST_KEY).filter((item) => !isLegacyMobileItem(item));

  window.localStorage.setItem(ACTIVE_CART_KEY, JSON.stringify(cartItems));
  window.localStorage.setItem(ACTIVE_WISHLIST_KEY, JSON.stringify(wishlistItems));

  legacyStorageKeys.forEach((key) => window.localStorage.removeItem(key));
  window.sessionStorage.removeItem("mobileCart");
  window.sessionStorage.removeItem("mobileWishlist");
  window.localStorage.setItem(CLEANUP_KEY, "true");
};
