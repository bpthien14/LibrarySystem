import { Router } from "express";
import * as bookController from "../controllers/book.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", bookController.getAllBooks);
router.get("/search", bookController.searchBooks);

router.get("/:id", bookController.getBookById);

router.post("/", 
  authMiddleware, 
  roleMiddleware(["admin", "librarian"]), 
  bookController.createBook
);

router.put("/:id", 
  authMiddleware, 
  roleMiddleware(["admin", "librarian"]), 
  bookController.updateBook
);

router.delete("/:id", 
  authMiddleware, 
  roleMiddleware(["admin"]), 
  bookController.deleteBook
);

export default router;