import { decode, encode } from "./encodings";

const getIntChunks = (fromUrl: string) => {
    let intChunks: number[] = [];

    if (!fromUrl) {
        return intChunks;
    }

    fromUrl = decode(fromUrl);
    const chunks = fromUrl.split('-');

    if (chunks.length != 2) {
        return intChunks;
    }

    let tmp = NaN;
    for ( let i = 0; i < chunks.length; i++) {
        tmp = parseInt(chunks[i], 32);
        
        if (Number.isNaN(tmp)) {
            return [];
        };

        intChunks.push(tmp);
    }

    return intChunks;
}


function newFromUrl (oldFromUrl: string): string {
    const intChunks = getIntChunks(oldFromUrl);

    let strChunks: string[] = new Array(2);

    if (!intChunks.length) {
        const baseChunk = (0).toString(32);
        return encode(strChunks.fill(baseChunk).join("-"));
    }

    if (intChunks[0] <= intChunks[1]) {
        strChunks[0] = (intChunks[0] + 1).toString(32);
        strChunks[1] = intChunks[1].toString(32);
    } else {
        strChunks[0] = intChunks[0].toString(32);
        strChunks[1] = (intChunks[1] + 1).toString(32);
    }
    
    return encode(strChunks.join("-"));
}


export default newFromUrl;