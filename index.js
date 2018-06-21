const https = require('https')

const descp = 'astrology';

let options = {
    hostname: 'www.googleapis.com',
    port: 443,
    path: '',
    method: 'GET'
}

// pseudo code to test with sort, extract & formatting code below
function getAllBookPages(callback, bookCount, title) {

    bkCount = bookCount || 0;

    options.path = '/books/v1/volumes?q=' + title + '&startIndex=' + bkCount;

    let test = https.request(options,

        function (responseObjServer) {

            const {statusCode} = responseObjServer;

            if (statusCode === 200) {

                let rawData = '';

                responseObjServer.on('data', (chunk) => {

                    rawData += chunk;

                });

                responseObjServer.on('end', () => {

                    try {

                        const parsedData = JSON.parse(rawData);

                        const booksFound = parsedData['items'].length;

                        for (let b = 0; b < booksFound; b++) {

                            let individualBookCount = bkCount + b;

                            console.log('Bk nr: ' + individualBookCount)

                            console.log('Title: ' + parsedData['items'][b].volumeInfo.title)

                            console.log('UID  : ' + parsedData['items'][b].id + ' AverageRating:  ' + parsedData['items'][b].volumeInfo.averageRating + '\n')
                        }
                        bkCount += booksFound;

                    } catch (e) {

                        console.error(e.message)

                    }
                });

                getAllBookPages(runGbook, bkCount, descp);

            } else {

                callback(bkCount);

            }
        });

    test.end()

}

// first call back
function runGbook(data) {


    data--;

    console.log('Total books found ' + data);

}

getAllBookPages(runGbook, null, descp);

