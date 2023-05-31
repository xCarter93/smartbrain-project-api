const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Incorrect Form Submission");
  }
  db.select("hash", "email")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      if (bcrypt.compareSync(password, data[0].hash)) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("Unable to get user"));
      } else {
        res.status(400).json("Incorrect credentials");
      }
    })
    .catch((err) => {
      res.status(400).json("Incorrect credentials");
    });
};

module.exports = {
  handleSignin: handleSignin,
};
