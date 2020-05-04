const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) 
        return res.status(400).json(`incorrect form submission`)
    db.select("email", "hash")
      .from("login")
      .where("email", "=", email)
      .then(data => {
        if (bcrypt.compareSync(password, data[0].hash)) {
          return db.select("*")
            .from("users")
            .where("email", "=", email)
            .then(user => {
              res.json(user[0])
            })
            .catch(err => res.status(400).json(`error logging in`))
        } else {
          res.status(400).json(`Email or password incorrect`)
        }
      })
      .catch( err => res.status(400).json(`Email cannot be found`))
  }

module.exports = {
  handleSignin
}