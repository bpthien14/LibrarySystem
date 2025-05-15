import { Router } from "express";
import * as memberController from "../controllers/member.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", 
  authMiddleware, 
  memberController.getAllMembers
);

router.get("/:id", 
  authMiddleware, 
  memberController.getMemberById
);

router.post("/", 
  authMiddleware, 
  roleMiddleware(["admin", "librarian"]), 
  memberController.createMember
);

router.put("/:id", 
  authMiddleware, 
  roleMiddleware(["admin", "librarian"]), 
  memberController.updateMember
);

router.delete("/:id", 
  authMiddleware, 
  roleMiddleware(["admin"]), 
  memberController.deleteMember
);

export default router;