var AWS = require('aws-sdk');
var uniqid = require("uniqid");

var handler = async(event)=> {
    var dynamodb = new AWS.DynamoDB ({
        apiVersion: '2012-08-10' ,
        endpoint: 'http://dynamodb:8000' ,
        region: 'us-west-2' ,
        credentials: {
            accessKeyId: '2345',
            secretAccessKey: '2345'
        }
    }) ;
var docClient = new AWS.DynamoDB.DocumentClient ({
    apiVersion: '2012-08-10' ,
    service: dynamodb ,
});
dynamodb.listTables(function (err, data) {
    if (err) {
        console.log("Error", err.code)
    } else {
        console.log("Los nombres de las tablas son ", data.TableNames)
    }
})
var table = "Envio";

    switch (event.httpMethod) {
        case "POST":
            if (event.body) {
                const params = {
                    TableName: table,
                    Item: {
                        Id: uniqid(),
                        fechaAlta: new Date().toISOString(),
                        destino: JSON.parse(event.body).destino,
                        email: JSON.parse(event.body).email,
                        pendiente: new Date().toISOString(),
                    },
                };
                return await docClient.put(params).promise()
                    .then((data) => {
                        return {
                            statusCode: 200,
                            body: JSON.stringify(data),
                        };
                    })
                    .catch((err) => {
                        console.log(err);
                        return {
                            statusCode: 500,
                            body: err.message,
                        };
                    });
            } else {
                return {
                    statusCode: 400,
                    body: "Se requiere destino y email",
                };
            }
        case "GET":
            const params = {
                TableName: table,
                FilterExpression: "attribute_exists(pendiente)",
            };
            return await docClient.scan(params).promise()
                .then((data) => {
                    return {
                        statusCode: 200,
                        body: JSON.stringify(data.Items),
                    };
                })
                .catch((err) => {
                    console.log(err);
                    return {
                        statusCode: 500,
                        body: err.message,
                    };
                });
        
        case "PUT":
            if (event.pathParameters.idEnvio) {
                const idEnvio = event.pathParameters.idEnvio;
                const params = {
                    TableName: table,
                    Key: {
                        Id: idEnvio,
                    },
                    UpdateExpression: "REMOVE pendiente",
                    ReturnValues: "UPDATED_NEW",
                };
                return await docClient.update(params).promise()
                    .then((data) => {
                        return {
                            statusCode: 200,
                            body: JSON.stringify(data),
                        };
                    })
                    .catch((err) => {
                        console.log(err);
                        return {
                            statusCode: 500,
                            body: err.message,
                        };
                    });
            } else {
                return {
                    statusCode: 400,
                    body: "Se requiere el Id del envio",
                };
            }
        default:
            return {
                statusCode: 500,
                body: "Metodo no soportado",
            };
    }
} ;
exports.handler = handler;
