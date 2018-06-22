const https = require('https')

const descp = 'witchcraft';

const cheapest5 = new Array(5);

let cheapCount = 0;

const topRated10 = new Array(10);

let options = {
    hostname: 'www.googleapis.com',
    port: 443,
    path: '',
    method: 'GET'
}

getBooksAndReview(runGbook, null, descp);

function getBooksAndReview(callback, bookCount, title) {

    bkCount = bookCount || 0;

    options.path = '/books/v1/volumes?q=' + title + '&startIndex=' + bkCount;

    let test = https.request(options,

        function (responseObjServer) {

            const {statusCode} = responseObjServer;

            if (bkCount < 100) {

                let rawData = '';

                responseObjServer.on('data', (chunk) => {

                    rawData += chunk;

                });

                responseObjServer.on('end', () => {

                    try {

                        const parsedData = JSON.parse(rawData);

                        const booksFound = parsedData['items'];

                        for (let b = 0; b < booksFound.length; b++) {

                            if (booksFound[b].saleInfo.saleability !== 'NOT_FOR_SALE') {

                                if (cheapCount < 5) {

                                    cheapest5[cheapCount] = booksFound[b];

                                    cheapCount = cheapCount + 1

                                } else {

                                    if (compareCostPerPage(cheapest5[0], booksFound[b]) >= 0) {

                                        cheapest5[0] = booksFound[b];

                                    }

                                    cheapest5.sort(compareCostPerPage);

                                }

                            }
                            /*
                            let individualBookCount = bkCount + b + 1;

                            console.log('Bk nr: ' + individualBookCount)

                            console.log('Title: ' + booksFound[b].volumeInfo.title)

                            console.log('UID  : ' + parsedData['items'][b].id + ' AverageRating:  ' + parsedData['items'][b].volumeInfo.averageRating + '\n')
                            */
                        }
                        bkCount += booksFound.length;

                    } catch (e) {

                        console.error(e.message)

                    }
                });

                getBooksAndReview(runGbook, bkCount, descp);

            } else {

                callback(bkCount);

            }
        });

    test.end()

}

// call back
function runGbook(data) {

    console.log('Total books comapred ' + data);

    console.log('5 Cheapest per Page ');
    console.log(cheapest5.map(book => {

        return '{   title: <' + book.volumeInfo.title + '>,' +
            'costPerPage: <' + cpp(book) + '> }'

    }));

}



// utility finctions below:--
//

function compareCostPerPage (a, b) {
    if (cpp(a) < cpp(b))
        return -1;
    if (cpp(a) > cpp(b))
        return 1;
    return 0;
}

function cpp(book) {
    if (book.saleInfo.saleability === 'FREE')
        return 0;
    return book.saleInfo.listPrice.amount / book.volumeInfo.pageCount;
}

function compareRating(a, b) {

// more undefined check
//    if(a.volumeInfo.averageRating && b.volumeInfo.averageRating) {
    if (a.volumeInfo.averageRating < b.volumeInfo.averageRating)
        return -1;
    if (a.volumeInfo.averageRating > b.volumeInfo.averageRating)
        return 1;
    return 0;

}
