

const {esClient} = require('./elasticClient');

async function saveToDB(doc) {
    try{
        await esClient.index({
            index: 'kijiji',
    
            document: doc
        });
    }catch(ex){
        console.log(ex);
    }
    console.log('saved to db');
}
module.exports = {saveToDB};
