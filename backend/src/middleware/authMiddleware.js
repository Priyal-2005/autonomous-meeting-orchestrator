const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

const authMiddleware = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, avatar: true, provider: true },
    });

    if (!user) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    next(error);
  }
};

module.exports = authMiddleware;
