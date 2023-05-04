// Clarifai config //

const PAT = process.env.CLARIFAI_PAT;
const USER_ID = 'hellmanlouis';
const APP_ID = 'face-detector-3000';

const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

const callClarifai = (model, imageUrl) => {
    return new Promise((resolve, reject) => {
        stub.PostModelOutputs(
            {
                user_app_id: {
                    "user_id": USER_ID,
                    "app_id": APP_ID
                },
                model_id: model,
                inputs: [
                    { data: { image: { url: imageUrl, allow_duplicate_url: true } } }
                ]
            },
            metadata,
            (err, response) => {
                if (err) {
                    reject(err);
                }
        
                if (response.status.code !== 10000) {
                    reject("Post model outputs failed, status: " + response.status.description);
                }
        
                resolve(response);
            }
        );
    })
}

const faceDetect = (req, res) => {
    callClarifai('face-detection', req.body.imageUrl)
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Clarifai face detection API failure'))
}

const colorRecognition = (req, res) => {
    callClarifai('color-recognition', req.body.imageUrl)
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Clarifai color recognition API failure'))
}

module.exports = {
    faceDetect: faceDetect,
    colorRecognition: colorRecognition
}