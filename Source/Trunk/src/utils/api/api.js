const call = (endpoint, body) => {
    let baseURL = process.env.SERVER_CONFIG.apiRoot;
    return new Promise(function (resolve, reject) {
        const tId = setTimeout(() => {
            // //hiện thông báo mất mạng hoặc mạng chậm
            // showAppNotification({
            //     id: 'networkError',
            //     type: 'error',
            //     msg: 'Vui lòng kiểm tra lại kết nối!!!'
            // });
            // reject(new Error('Timeout'))
            resolve({error: {statusCode: 408, message: 'Vui lòng kiểm tra lại kết nối!!!'}});
        }, 15000);
        fetch(baseURL + endpoint, {...body})
            .then(async (data) => {
                let _data = await data.json();
                resolve(_data);
                clearTimeout(tId);
            })
            .catch((err) => {
                // //hiện thông báo mất mạng hoặc mạng chậm
                // showAppNotification({
                //     id: 'networkError',
                //     type: 'error',
                //     msg: 'Vui lòng kiểm tra lại kết nối!!!'
                // });
                resolve({error: {statusCode: 408, message: 'Vui lòng kiểm tra lại kết nối!!!'}});
                clearTimeout(tId);
            })
    })
};

const header = (token) => ({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': token,
});

export {call, header}