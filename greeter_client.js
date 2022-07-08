var PROTO_PATH = __dirname + '/ProShop.proto'

var fs = require('fs')
var grpc = require('grpc')
var protoLoader = require('@grpc/proto-loader')
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})
var proshop_proto = grpc.loadPackageDefinition(packageDefinition).proshop

const localChannelOptions = {
  'grpc.ssl_target_name_override': 'grpc.test.google.fr',
}

function main() {
  var channelCreds = grpc.credentials.createSsl(fs.readFileSync('ca.pem'))
  var callCreds = grpc.credentials.createFromMetadataGenerator(
    (context, callback) => {
      const metadata = new grpc.Metadata()
      metadata.set('authfoo', 'authbar')
      callback(null, metadata)
    }
  )
  var creds = grpc.credentials.combineChannelCredentials(
    channelCreds,
    callCreds
  )
  var client = new proshop_proto.Orders(
    'localhost:50051',
    creds,
    localChannelOptions
  )

  var metadata = new grpc.Metadata()
  metadata.set('headerKey1', 'headerval1')
  metadata.set('headerKey2', 'headerval2')
  metadata.set('complexheader3', '{"result":true, "count":42}')
  metadata.set('generalfoo4', 'headerval4')
  metadata.set('generalfoo5', 'headerval5')
  metadata.set('generalfoo6', 'headerval6')
  metadata.set('generalfoo7', 'headerval7')
  metadata.set('generalfoo8', 'headerval8')

  //call server

  client.getOrders({ orderId: 1 }, metadata, function (err, response) {
    console.log('orders:', response)
  })
}

main()
