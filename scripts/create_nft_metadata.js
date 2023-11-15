const fs = require('fs');
const peach = require('parallel-each');
const pinataSDK = require('@pinata/sdk');

let pictures = JSON.parse(fs.readFileSync("./data/pictures.json"))
let properNFTMetadata = []
const pinata = new pinataSDK('8cce6d56d621de442deb', 'b6d30ed48e034f9b6cd20ec89e684b6fc0510dd5036169bf284590e8a4dbcccc')


async function main() {


    for (const picture of pictures) {
        var record = {
            "name": ("Работа № " + picture['number'] + ". " + picture['title']).trim(),
            "image": "ipfs://" + picture['resized_cid'],
            "original_image": "ipfs://" + picture['original_cid'],
            "description": picture['description'],
            "work_number": picture['number']
        };

        if (picture["emotion"] && picture["theme"]) {
            record.attributes = [
                {
                    "trait_type": "mood",
                    "value": picture["emotion"],
                },
                {
                    "trait_type": "theme",
                    "value": picture["theme"],
                },
            ]
        }

        let result = await pinata.pinJSONToIPFS(record, {});
        record.cid = result.IpfsHash;
        properNFTMetadata.push(record)
        console.log(record.name)
    }
    
    fs.writeFileSync("./data/metadata.json", JSON.stringify(properNFTMetadata));
}

main()