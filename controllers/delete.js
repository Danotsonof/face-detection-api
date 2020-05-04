const deleteAccount = (req, res, db, bcrypt) => {
  const { email } = req.body;
  db.select("email")
    .from("login")
    .where("email", "=", email)
    .del()
    .then(
      db.select("email")
    .from("users")
    .where("email", "=", email)
	.del()
    .then(
      db.select("*")
    .from("records")
    .where("email", "=", email)
    .update({status: 'deactivated'})
    .then(res.status(200).json(`Account Successfully Deleted`))
    .catch((err) => res.status(400).json(`unable to get user`))
    ))
    .catch((err) => res.status(400).json(`unable to get user`));
};

module.exports = {
  deleteAccount,
};
