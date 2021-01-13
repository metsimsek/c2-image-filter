import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import { Request, Response } from 'express';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  app.get("/:image_url", async (req : Request, res : Response) => {
    let image_url: string = req.query.image_url;
    if (image_url == null || image_url == "") {
      res.statusCode = 422;
      res.end('image url is not found');
    }

    await filterImageFromURL(image_url)
      .catch((error) => {
        res.statusCode = 422;
        res.end('filter image error ' + error);
      })
      .then(value => {

        res.sendFile(__dirname + "/util/tmp/filteredCatPicture.jpg", (err) => {
          if (err) {
            res.status(500).send({
              message: "Could not send the file " + err,
            });
          }
          res.statusCode = 200;
        });

        let files: Array<string> = [__dirname + "/util/tmp/filteredCatPicture.jpg"];
        res.on('finish', () => deleteLocalFiles(files));

      });

  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req : Request, res : Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();