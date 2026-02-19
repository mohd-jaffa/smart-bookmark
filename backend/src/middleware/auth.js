const { supabase } = require("../config/supabaseClient");

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing auth token" });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ message: "Invalid auth token" });
  }

  req.user = data.user;
  next();
};

module.exports = { requireAuth };
