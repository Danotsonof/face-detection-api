const handleRegister = (req, res, db, bcrypt) => {
  /* const accountsUpdate = (email) => {
    db.select("email")
      .from("records")
      .where("email", "=", email)
      .del()
      .then(
        db("records")
		.insert([{
          email: email,
          status: "active",
        }])
		.then(() => {return 0}))
  }; */
  const accountsUpdate = (email) => {
    db.select("email")
      .from("records")
      .where("email", "=", email)
      .then( data => {
		  if (data.length) {
			  db("records")
				.where("email", "=", email)
			  .update({status: 'active'})
			  .then(() => {return 0})
		  } else {
			  db("records")
				.insert([{
			  email: email,
			  status: "active",
			}]).then(() => {return 0})
		  }
        })
  };
  const saltRounds = 10;
  const { email, name, password } = req.body;
  if (!email || !name || !password)
    return res.status(400).json(`incorrect form submission`);
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((userEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            name: name[0].toUpperCase() + name.slice(1),
            email: userEmail[0],
            joined: new Date(),
          })
          .then((user) => {
            accountsUpdate(user[0]["email"]);
            res.json(user[0]["email"]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("unable to register"));
};

module.exports = {
  handleRegister,
};
