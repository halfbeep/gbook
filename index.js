const https = require('https')

const titleDescp = 'astrology';

let bookCount = 0;

let options = {
    hostname: 'www.googleapis.com',
    port: 443,
    path: '/books/v1/volumes?q=' + titleDescp + '&startIndex=' + bookCount,
    method: 'GET'
}

// pseudo code to integrate and test with working code below
function getAllBookPages(callback, page) {
    page = page || 1;
    https.request.get(options,
        success: function (data) {
            if (data.is_last_page) {
                // We are at the end so we call the callback
                callback(page);
            } else {
                // We are not at the end so we recurse
                get_all_pages(callback, page + 1);
            }
        }
    }
}

function show_page_count(data) {
    console.log(data);
}

getAllBookPages(show_page_count);


///// ******************

// work in progress below

    const callback = function (resObjServer) {

        const { statusCode } = resObjServer;

        const contentType = resObjServer.headers['content-type']

        let error;


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

                bookCount = bookCount + parsedData['items'].length;

                for(let i = 0; i < parsedData['items'].length; i++)
                {

                    console.log('Title: ' + parsedData['items'][i].volumeInfo.title)
                    console.log('UID  : ' + parsedData['items'][i].id  + ' AverageRating:  '  + parsedData['items'][i].volumeInfo.averageRating + '\n')

                }

                console.log('Book count ' + bookCount)


            } catch (e) {

            console.error(e.message)

            }
        })

    }

    let reqObjServer = https.request(options, callback)
    reqObjServer.setHeader('user-agent', 'rapto foo blah')
    reqObjServer.setHeader('accept','application/json')
    reqObjServer.end()

console.log('Gbook Rapto Started ')
