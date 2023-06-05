// Protected route
exports.protected = async (req, res) => {
  const user = req.user;
  // Authorized access
  return res.json({
    success: true,
    msg: 'You are authorized to access this route',
    error: null,
    user,
  });
};
