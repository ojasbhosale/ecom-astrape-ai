const express = require("express")
const { body, validationResult } = require("express-validator")
const { CartItem, Item } = require("../models")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Get user's cart
router.get("/", authenticateToken, async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Item,
          as: "item",
          attributes: ["id", "name", "description", "category", "price"],
        },
      ],
      order: [["created_at", "DESC"]],
    })

    // Calculate total
    const total = cartItems.reduce((sum, cartItem) => {
      return sum + Number.parseFloat(cartItem.item.price) * cartItem.quantity
    }, 0)

    res.json({
      cartItems,
      total: Number.parseFloat(total.toFixed(2)),
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    })
  } catch (error) {
    console.error("Get cart error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Add item to cart
router.post(
  "/add",
  authenticateToken,
  [
    body("itemId").isInt({ min: 1 }).withMessage("Valid item ID is required"),
    body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        })
      }

      const { itemId, quantity = 1 } = req.body
      const userId = req.user.id

      // Check if item exists
      const item = await Item.findByPk(itemId)
      if (!item) {
        return res.status(404).json({ error: "Item not found" })
      }

      // Check if item is already in cart
      const existingCartItem = await CartItem.findOne({
        where: { userId, itemId },
      })

      if (existingCartItem) {
        // Update quantity
        existingCartItem.quantity += Number.parseInt(quantity)
        await existingCartItem.save()

        const updatedCartItem = await CartItem.findByPk(existingCartItem.id, {
          include: [
            {
              model: Item,
              as: "item",
              attributes: ["id", "name", "description", "category", "price"],
            },
          ],
        })

        res.json({
          message: "Cart updated successfully",
          cartItem: updatedCartItem,
        })
      } else {
        // Create new cart item
        const cartItem = await CartItem.create({
          userId,
          itemId: Number.parseInt(itemId),
          quantity: Number.parseInt(quantity),
        })

        const newCartItem = await CartItem.findByPk(cartItem.id, {
          include: [
            {
              model: Item,
              as: "item",
              attributes: ["id", "name", "description", "category", "price"],
            },
          ],
        })

        res.status(201).json({
          message: "Item added to cart successfully",
          cartItem: newCartItem,
        })
      }
    } catch (error) {
      console.error("Add to cart error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  },
)

// Remove item from cart
router.post(
  "/remove",
  authenticateToken,
  [
    body("itemId").isInt({ min: 1 }).withMessage("Valid item ID is required"),
    body("removeAll").optional().isBoolean().withMessage("removeAll must be a boolean"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        })
      }

      const { itemId, removeAll = false } = req.body
      const userId = req.user.id

      const cartItem = await CartItem.findOne({
        where: { userId, itemId },
      })

      if (!cartItem) {
        return res.status(404).json({ error: "Item not found in cart" })
      }

      if (removeAll || cartItem.quantity <= 1) {
        // Remove item completely
        await cartItem.destroy()
        res.json({ message: "Item removed from cart successfully" })
      } else {
        // Decrease quantity
        cartItem.quantity -= 1
        await cartItem.save()

        const updatedCartItem = await CartItem.findByPk(cartItem.id, {
          include: [
            {
              model: Item,
              as: "item",
              attributes: ["id", "name", "description", "category", "price"],
            },
          ],
        })

        res.json({
          message: "Cart updated successfully",
          cartItem: updatedCartItem,
        })
      }
    } catch (error) {
      console.error("Remove from cart error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  },
)

module.exports = router
