const https = require('https')

const descp = 'astrology';

let options = {
    hostname: 'www.googleapis.com',
    port: 443,
    path: '',
    method: 'GET'
}

getBooksAndReview(runGbook, null, descp);

// pseudo code to test with sort, extract & formatting code below
function getBooksAndReview(callback, bookCount, title) {

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

                            /*
                            if(compareCostPerPage(cheapest5[0], booksFound[b]) >= 0) {

                                // requires type checking see ReadMe
                                cheapest5[0] = booksFound[b];

                                cheapest5.sort(compareCostPerPage);

                            }
                            */ //

                            let individualBookCount = bkCount + b;

                            console.log('Bk nr: ' + individualBookCount)

                            console.log('Title: ' + parsedData['items'][b].volumeInfo.title)

                            // console.log('UID  : ' + parsedData['items'][b].id + ' AverageRating:  ' + parsedData['items'][b].volumeInfo.averageRating + '\n')
                        }
                        bkCount += booksFound;

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

// first call back
function runGbook(data) {


    data--;

    console.log('Total books found ' + data);

    // TODO; here dump print both arrays here with format as suggested


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

// undefined check
function cpp(book) {
    //   if (book && book.saleInfo.listPrice.amount && book.volumeInfo.pageCount)
    //      return book.saleInfo.listPrice.amount / book.volumeInfo.pageCount;
    return Number.MAX_SAFE_INTEGER
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
