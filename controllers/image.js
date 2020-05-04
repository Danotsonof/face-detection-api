const Clarifai = require("clarifai");

const APIKEY = process.env.CLARIFAI_KEY; //insert your Api Key from clarifai here

const app = new Clarifai.App({
    apiKey: APIKEY
});

const handleClarifaiApi = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => res.json(data))
}

const handleImage = (req, res, db) => {
    const { email, entries } = req.body;
    db.select("*")
        .from("users")
        .where({ email })
        .increment("entries", entries)
        .returning("entries")
        .then(entries => {
            if (entries[0] >= 0) res.json(entries[0]);
            else res.status(400).json("no such user");
        })
        .catch(err => res.status(400).json("unable to get entries"));
}

module.exports = {
    handleImage,
    handleClarifaiApi
}