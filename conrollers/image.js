const axios = require("axios");

const handleApiCall = (req, res) => {
  const PAT = process.env.CLARIFAI_PAT;
  const USER_ID = "xcarter93";
  const APP_ID = "smart-brain";
  const IMAGE_URL = req.body.input;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  // const requestOptions = {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     Authorization: "Key " + PAT,
  //   },
  //   body: raw,
  // };

  axios
    .post(`https://api.clarifai.com/v2/models/face-detection/outputs`, raw, {
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
    })
    .then((response) => {
      res.json(response.data);
    })
    .catch((err) => res.status(400).json("unable to work with api"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => {
      res.status(400).json("Unable to get entries");
    });
};

module.exports = {
  handleApiCall,
  handleImage,
};
