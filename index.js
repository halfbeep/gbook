const https = require('https')

    let titleDescp = 'harry+potter';

    const options = {
        hostname: 'www.googleapis.com',
        port: 443,
        path: '/books/v1/volumes?q=' + titleDescp, // + '&callback=handleResponse',
        method: 'GET'
    }

    const callback = function (resObjServer) {

        const { statusCode } = resObjServer;

        const contentType = resObjServer.headers['content-type']

        let error

        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                `Status Code: ${statusCode}`)

        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                `Expected application/json but received ${contentType}`)
        }
        if (error) {

            console.error(error.message);

            // consume response data to free up memory
            resObjServer.resume();

            return;

        }

        resObjServer.setEncoding('utf8');

        let rawData = '';

        resObjServer.on('data', (chunk) => { rawData += chunk; });

        resObjServer.on('end', () => {

            try {



                const parsedData = JSON.parse(rawData);

                for(let i = 0; i < parsedData['items'].length; i++)
                {

                    console.log('Title: ' + parsedData['items'][i].volumeInfo.title)
                    console.log('UID  : ' + parsedData['items'][i].id  + ' AverageRating:  '  + parsedData['items'][i].volumeInfo.averageRating + '\n')

                }


            } catch (e) {

            console.error(e.message)

            }
        })
    }

    var reqObjServer = https.request(options, callback)
    reqObjServer.setHeader('user-agent', 'rapto foo blah')
    reqObjServer.setHeader('accept','application/json')
    reqObjServer.end()

console.log('Gbook Rapto Started ')