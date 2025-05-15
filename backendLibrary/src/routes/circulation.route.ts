import { Router } from "express";
import * as circulationController from "../controllers/circulation.controller";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/borrowings", 
  authMiddleware, 
  circulationController.getBorrowings
);

router.get("/borrowings/:id", 
  authMiddleware, 
  circulationController.getBorrowingById
);

router.post("/borrow", 
  authMiddleware, 
  roleMiddleware(["admin", "librarian"]), 
  circulationController.createBorrowing
);

router.put("/return/:id", 
  authMiddleware, 
  roleMiddleware(["admin", "librarian"]), 
  circulationController.returnBorrowing
);

router.put("/renew/:id", 
  authMiddleware, 
  circulationController.renewBorrowing
);

router.get("/reservations", 
  authMiddleware, 
  circulationController.getReservations
);

router.get("/reservations/:id", 
  authMiddleware, 
  circulationController.getReservationById
);

router.post("/reserve", 
  authMiddleware, 
  circulationController.createReservation
);

router.put("/reservations/:id/status", 
  authMiddleware, 
  roleMiddleware(["admin", "librarian"]), 
  circulationController.updateReservationStatus
);

router.post("/reservations/:id/notify", 
  authMiddleware, 
  roleMiddleware(["admin", "librarian"]), 
  circulationController.sendReservationNotification
);

export default router;