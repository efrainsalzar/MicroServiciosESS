/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         name: John Doe
 *         email: john@example.com
 *         role: user
 *         created_at: "2023-01-01T00:00:00Z"
 * 
 *     UserRegister:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *         email:
 *           type: string
 *           format: email
 *         password_hash:
 *           type: string
 *           minLength: 6
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 *       example:
 *         name: John Doe
 *         email: john@example.com
 *         password_hash: securePassword123
 *         role: user
 * 
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password_hash
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password_hash:
 *           type: string
 *       example:
 *         email: john@example.com
 *         password_hash: securePassword123
 * 
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *       example:
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           id: 1
 *           name: John Doe
 *           email: john@example.com
 *           role: user
 */


/**
 * @swagger
 * /api/getPrivate:
 *   get:
 *     summary: Get all users (private - requires auth)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (invalid token)
 *       500:
 *         description: Server error
 */