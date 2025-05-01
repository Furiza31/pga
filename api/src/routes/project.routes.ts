import express from "express";
import projectController from "../controllers/project.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticate, projectController.getAllProjects);
router.get("/users/search/:query", authenticate, projectController.searchUsers);
router.get("/my-projects", authenticate, projectController.getMyProjects);
router.get("/:id", authenticate, projectController.getProjectById);
router.post("/", authenticate, projectController.createProject);
router.put("/:id", authenticate, projectController.updateProject);
router.delete("/:id", authenticate, projectController.deleteProject);

router.get("/:id/members", authenticate, projectController.getProjectMembers);
router.post("/:id/members", authenticate, projectController.addProjectMember);
router.delete(
  "/:id/members/:userId",
  authenticate,
  projectController.removeProjectMember
);

export default router;
