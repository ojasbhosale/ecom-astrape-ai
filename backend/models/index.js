const User = require("./User")
const Item = require("./Item")
const CartItem = require("./CartItem")

// Define associations
User.hasMany(CartItem, { foreignKey: "userId", as: "cartItems" })
CartItem.belongsTo(User, { foreignKey: "userId", as: "user" })

Item.hasMany(CartItem, { foreignKey: "itemId", as: "cartItems" })
CartItem.belongsTo(Item, { foreignKey: "itemId", as: "item" })

module.exports = {
  User,
  Item,
  CartItem,
}
