const fs = require("fs");
const path = require("path");
const Hash = require("ipfs-only-hash");

let directoryPath = "";
let pictures = JSON.parse(fs.readFileSync("./data/pictures.json"));

async function main() {
  let files = fs.readdirSync(directoryPath);

  for (var file of files) {
    let number = parseInt(file.split(" ")[0]);

    pictureEntry = pictures.filter((picture) => picture.number == number)[0];

    if (!pictureEntry) {
      console.log(number);
      return;
    }

    pictureIndex = pictures.indexOf(pictureEntry);
    pictures[pictureIndex].original_filename = file;

    let fullPath = path.join(directoryPath, file);

    console.log("uploading file... " + fullPath);
    let pic = fs.readFileSync(fullPath);
    const cid = await Hash.of(pic);
    pictures[pictureIndex].resized_cid = cid.toString();

    fs.writeFileSync("./data/pictures.json", JSON.stringify(pictures));
  }
}

main();
