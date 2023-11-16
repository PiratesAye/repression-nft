const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const path = require('path');
const peach = require('parallel-each');


const pinata = new pinataSDK('8cce6d56d621de442deb', 'b6d30ed48e034f9b6cd20ec89e684b6fc0510dd5036169bf284590e8a4dbcccc')


let directoryPath = "/run/media/cwiz/c46c7d5f-d870-4533-a000-bc061fe892ed/Pictures/kris"
let pictures = JSON.parse(fs.readFileSync("./data/pictures.json"))

const Hash = require('ipfs-only-hash')



async function main() {
    // const ipfs = await IPFS.create({start: false})

    let files = fs.readdirSync(directoryPath);

    // iterate over all files in the directory
    // peach(files, async (file) => {
    for( var file of files) {
        let number = parseInt(file.split(" ")[0]);

        console.log(number)

        pictureEntry = pictures.filter(picture => picture.number == number)[0]

        if (!pictureEntry) {
            console.log(number)
            return;
        }

        pictureIndex = pictures.indexOf(pictureEntry)
        pictures[pictureIndex].original_filename = file

        let fullPath = path.join(directoryPath, file);

        const readableStreamForFile = fs.createReadStream(fullPath);
        const options = {
            pinataMetadata: {
                name: file,
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        console.log('uploading file... ' + fullPath)
        let pic = fs.readFileSync(fullPath)
        // let result = await pinata.pinFileToIPFS(readableStreamForFile, options);
        // pictures[pictureIndex].original_cid = result.IpfsHash;

        // const { cid } = await ipfs.add(pic,{onlyHash:true,cidVersion:1,hashAlg:'blake2b-256'})
        const cid = await Hash.of(pic)
        pictures[pictureIndex].original_cid = cid.toString()

        fs.writeFileSync("./data/pictures.json", JSON.stringify(pictures));        
    }
}

main()