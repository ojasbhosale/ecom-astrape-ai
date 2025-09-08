const express = require("express")
const { body, query, param, validationResult } = require("express-validator")
const { Item } = require("../models")
const { authenticateToken } = require("../middleware/auth")
const { Op } = require("sequelize")

const router = express.Router()

// Get all items with optional filters
router.get(
  "/",
  [
    query("category").optional().trim().isLength({ min: 1 }),
    query("minPrice").optional().isFloat({ min: 0 }),
    query("maxPrice").optional().isFloat({ min: 0 }),
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

      const { category, minPrice, maxPrice } = req.query
      const whereClause = {}

      // Apply filters
      if (category) {
        whereClause.category = { [Op.iLike]: `%${category}%` }
      }

      if (minPrice || maxPrice) {
        whereClause.price = {}
        if (minPrice) whereClause.price[Op.gte] = Number.parseFloat(minPrice)
        if (maxPrice) whereClause.price[Op.lte] = Number.parseFloat(maxPrice)
      }

      const items = await Item.findAll({
        where: whereClause,
        order: [["created_at", "DESC"]],
      })

      res.json({
        items,
        count: items.length,
      })
    } catch (error) {
      console.error("Get items error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  },
)

// Create new item (requires authentication)
router.post(
  "/",
  authenticateToken,
  [
    body("name").trim().isLength({ min: 1, max: 255 }).withMessage("Name must be between 1 and 255 characters"),
    body("description").optional().trim(),
    body("category").trim().isLength({ min: 1, max: 100 }).withMessage("Category must be between 1 and 100 characters"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
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

      const { name, description, category, price } = req.body

      const item = await Item.create({
        name,
        description,
        category,
        price: Number.parseFloat(price),
      })

      res.status(201).json({
        message: "Item created successfully",
        item,
      })
    } catch (error) {
      console.error("Create item error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  },
)

// Update item (requires authentication)
router.put(
  "/:id",
  authenticateToken,
  [
    param("id").isInt({ min: 1 }).withMessage("Invalid item ID"),
    body("name")
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage("Name must be between 1 and 255 characters"),
    body("description").optional().trim(),
    body("category")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Category must be between 1 and 100 characters"),
    body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
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

      const { id } = req.params
      const updates = req.body

      const item = await Item.findByPk(id)
      if (!item) {
        return res.status(404).json({ error: "Item not found" })
      }

      // Convert price to float if provided
      if (updates.price) {
        updates.price = Number.parseFloat(updates.price)
      }

      await item.update(updates)

      res.json({
        message: "Item updated successfully",
        item,
      })
    } catch (error) {
      console.error("Update item error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  },
)

// Delete item (requires authentication)
router.delete(
  "/:id",
  authenticateToken,
  [param("id").isInt({ min: 1 }).withMessage("Invalid item ID")],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        })
      }

      const { id } = req.params

      const item = await Item.findByPk(id)
      if (!item) {
        return res.status(404).json({ error: "Item not found" })
      }

      await item.destroy()

      res.json({ message: "Item deleted successfully" })
    } catch (error) {
      console.error("Delete item error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  },
)

module.exports = router
