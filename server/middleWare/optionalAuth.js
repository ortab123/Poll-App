const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) {
    const token = auth.slice(7);
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      // payload יכול להכיל id,email
      req.user = payload;
    } catch (err) {
      // invalid token — נדלג (לא נשים שגיאה כי זה אופציונלי)
    }
  }
  next();
};
