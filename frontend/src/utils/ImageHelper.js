import defaultAvatar from "../assets/img/default-avatar.jpg";
import defaultProduct from "../assets/img/productPlaceholder.jpg"

export const getAvatarUrl = (avatarUrl) => {
    if (avatarUrl && avatarUrl.startsWith("https")) {
        return avatarUrl;
    }
    return defaultAvatar;
};

export const getProductUrl = (productUrl) => {
    if (productUrl && productUrl.startsWith("https")) {
        return productUrl;
    }
    return defaultProduct;
}