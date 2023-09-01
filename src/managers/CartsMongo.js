//Creamos un nuevo manager de CARRITOS para manejar productos con MONGO/MONGOOSE
import Cart from '../db/models/carts.model.js';

class CartsMongo {
  async findAll() {
    try {
      const products = await Cart.find({})
      return products
    } catch (error) {
      return error
    }
  }
  async createOne(obj) {
    try {
      const product = await Cart.create(obj)
      return product
    } catch (error) {
      return error
    }
  }
  async findById(id) {
    try {
      const product = await Cart.findById(id).populate('products')
      return product
    } catch (error) {
      return error
    }
  }
  async updateOne(id, obj) {
    try {
      const response = await Cart.updateOne({ _id: id }, { ...obj })
      return response
    } catch (error) {
      return error
    }
  }
  async deleteOne(id) {
    try {
      const response = await Cart.findByIdAndDelete(id)
      return response
    } catch (error) {
      return error
    }
  }
  
  async deleteProduct(idCart,idProduct){
    try {
        const cart = await Cart.findById(idCart)
        if(!cart) throw new Error('product not found')
        
        const response = await Cart.updateOne({_id:idCart},{$pull:{product:idProduct}})
      return response



    } catch (error) {
      return error
    }
  }
  //Actualizar cantidad de un producto específico
  async updateProductQuantity(cartId, productId, newQuantity) {
    const cart = await this.getCartById(cartId);
    const product = cart.products.find(p => p.product.equals(productId));
    if (product) {
      product.quantity = newQuantity;
    }

    try {
      await this.saveCart(cart);
      console.log(`Cantidad del producto actualizada en el carrito ${cartId}`);
    } catch (error) {
      throw new Error('Error al guardar el carrito: ' + error.message);
    }

    return cart;
  }
}
export const cartsMongo = new CartsMongo()