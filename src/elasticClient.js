'use strict'

const { Client } = require('@elastic/elasticsearch');
const config = require('./config');

const client = new Client({ 
    node: `https://${config.es_host}:${config.es_port}`,
    auth: {
        username: config.es_user,
        password: config.es_pass,
    },
    tls: {
        rejectUnauthorized: false
    }

});

module.exports.esClient= client;