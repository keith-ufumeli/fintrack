import express from "express";
import { 
  getLoans, 
  addLoan, 
  updateLoan, 
  deleteLoan 
} from "../controllers/loanController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/loans:
 *   post:
 *     summary: Create a new loan/borrow entry
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - person
 *               - amount
 *               - type
 *             properties:
 *               person:
 *                 type: string
 *                 description: Name of the person involved in the loan
 *               amount:
 *                 type: number
 *                 description: Loan amount
 *               type:
 *                 type: string
 *                 enum: [lend, borrow]
 *                 description: Type of loan - lend (I gave money) or borrow (I received money)
 *               description:
 *                 type: string
 *                 description: Loan description
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Loan date (optional, defaults to current date)
 *               status:
 *                 type: string
 *                 enum: [unpaid, paid]
 *                 description: Loan status (optional, defaults to unpaid)
 *     responses:
 *       201:
 *         description: Loan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.post("/", authenticateToken, addLoan);

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Get all loan records for authenticated user
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all loans for the user sorted by date (newest first)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Loan'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", authenticateToken, getLoans);

/**
 * @swagger
 * /api/loans/{id}:
 *   put:
 *     summary: Update loan status or details
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Loan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               person:
 *                 type: string
 *                 description: Name of the person involved in the loan
 *               amount:
 *                 type: number
 *                 description: Loan amount
 *               type:
 *                 type: string
 *                 enum: [lend, borrow]
 *                 description: Type of loan
 *               description:
 *                 type: string
 *                 description: Loan description
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Loan date
 *               status:
 *                 type: string
 *                 enum: [unpaid, paid]
 *                 description: Loan status
 *     responses:
 *       200:
 *         description: Loan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: Loan not found
 */
router.put("/:id", authenticateToken, updateLoan);

/**
 * @swagger
 * /api/loans/{id}:
 *   delete:
 *     summary: Delete a loan record
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Loan ID
 *     responses:
 *       200:
 *         description: Loan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan deleted successfully"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", authenticateToken, deleteLoan);

export default router;
