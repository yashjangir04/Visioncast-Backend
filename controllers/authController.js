const validateAuth = (req, res) => {
  res.status(200).json({
    valid: true,
    user: req.user,
  });
};

module.exports = { validateAuth };