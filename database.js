var params = {
    TableName: 'Envio',
    KeySchema: [
        {
            AttributeName: 'Id',
            KeyType: 'HASH'
        }
    ],
        GlobalSecondaryIndexes: [{
            IndexName: 'ImageId-index',
            KeySchema: [
                {
                    AttributeName: 'Id',
                    KeyType: 'HASH'
                },
                {
                    AttributeName: 'pendiente',
                    KeyType: 'RANGE'
                }
            ],
            Projection: {
                ProjectionType: 'KEYS_ONLY'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        }
    ],
    AttributeDefinitions: [
        {
            AttributeName: 'Id',
            AttributeType: 'S'
        },
        {
            AttributeName: 'pendiente',
            AttributeType: 'S'
        }
    ],
    ProvisionedThroughput:  {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};
console.log("Creating the Image table");
dynamodb.createTable(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});