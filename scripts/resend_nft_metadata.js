import * as fs from 'fs'
import * as IPFS from 'ipfs-core'  

let nfts = JSON.parse(fs.readFileSync("./data/metadata.json"))
let newNFTs = []

async function uploadMetadataToIPFS(ipfs, metadata) {
    const { cid } = await ipfs.add(metadata)
    await ipfs.pin.add(cid.toString())
    return cid.toString()
}

async function main() {

    
    const ipfs = await IPFS.create()
    
    for (const nft of nfts) {
        delete nft.cid
       
        nft.cid = await uploadMetadataToIPFS(ipfs, nft)      
        newNFTs.push(nft)
        console.log(nft.name)
        console.log(nft.cid)
    }
    
    fs.writeFileSync("./data/metadata.json", JSON.stringify(newNFTs));
}

main()