const express = require('express');
const helmet= require('helmet');

const server= express();

// built-in middleware
server.use(express.json());

//third party middleware
server.use(helmet());

module.exports= server;