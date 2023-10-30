const clipboardPremissions = () => {
    return new Promise((resolve, reject) => {
        navigator.permissions.query({name: "clipboard-write"})
        .then(premStatus => {
            if (premStatus.state === 'granted') {
                resolve(true);
            } else if (premStatus.state === 'prompt') {
                navigator.permissions.request({name: 'clipboard-write'})
                .then(newPremStatus => {
                    if (newPremStatus.state === 'granted') {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }).catch(e=>reject(e));
            } else {
                resolve(false);
            }
        }).catch(e=>reject(e));
    })
}