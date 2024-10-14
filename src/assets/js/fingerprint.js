export async function fingerprint(){
    const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4')
        .then(FingerprintJS => FingerprintJS.load());
    
    // Get the visitor identifier when you need it.
    return fpPromise
        .then(fp => fp.get())
        .then(result => {
            // This is the visitor identifier:
            const visitorId = result.visitorId
            return visitorId
        }).catch(error => "");
}
