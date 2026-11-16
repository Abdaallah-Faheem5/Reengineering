import Wishlist = require("../../models/wishlist.model");
import Product = require("../../models/product.model");

function createError(status: number, message: string | undefined) {
  const err = new Error(message);
  (err as any).status = status;
  (err as any).statusCode = status;
  return err;
}

const wishlistPopulateConfig = {
  path: 'products',
  populate: {
    path: 'category',
    select: 'name'
  }
};

class WishlistService {
  async getWishlistByUserId(userId: any) {
    let wishlist = await Wishlist.findOne({ user: userId }).populate(wishlistPopulateConfig);

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
      await wishlist.populate(wishlistPopulateConfig);
    }

    return wishlist;
  }

  async addProduct(userId: any, payload: { productId: any; }) {
    const { productId } = payload;

    const product = await Product.findById(productId).lean();
    if (!product) {
      throw createError(404, 'Product not found');
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    const alreadyExists = wishlist.products.some(
      (id) => String(id) === String(product._id)
    );

    if (!alreadyExists) {
      wishlist.products.push(product._id);
      await wishlist.save();
    }

    await wishlist.populate(wishlistPopulateConfig);
    return wishlist;
  }

  async removeProduct(userId: any, productId: any) {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    wishlist.products = wishlist.products.filter(
      (id) => String(id) !== String(productId)
    );

    await wishlist.save();
    await wishlist.populate(wishlistPopulateConfig);
    return wishlist;
  }

  async clearWishlist(userId: any) {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    } else {
      wishlist.products = [];
      await wishlist.save();
    }

    await wishlist.populate(wishlistPopulateConfig);
    return wishlist;
  }
}

export = new WishlistService();
