import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { createCategory, getCategories, editCategory, deleteCategory } from "../controllers/categoryController.js";

const router = Router();

router.post('/', verifyToken, createCategory);
router.get('/', verifyToken, getCategories);
router.put('/:id', verifyToken, editCategory);
router.delete('/:id', verifyToken, deleteCategory);

export default router;