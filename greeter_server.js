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
const DATA = [
  {
    orderId: 1,
    orderDescription: 'Gift order',
    products: [
      {
        productId: 1,
        description: 'Nike Shoes',
        quantity: 1,
        price: 95.22,
      },
      {
        productId: 1,
        description: 'DKNY Applue',
        quantity: 1,
        price: 35.22,
        testExtraPropertyWhichIsNotInProto: 'will not appear in output',
      },
    ],
  },
]

var proshop_proto = grpc.loadPackageDefinition(packageDefinition).proshop

function getOrders(call, callback) {
  console.log(call.metadata)
  const query = DATA.filter((el) => el.customerID === call.request.id)
  callback(null, query[0])
}

function main() {
  var server = new grpc.Server()
  server.addService(proshop_proto.Orders.service, { getOrders: getOrders })
  server.bind(
    '0.0.0.0:50051',
    grpc.ServerCredentials.createSsl(null, [
      {
        private_key: fs.readFileSync('key.pem'),
        cert_chain: fs.readFileSync('cert.pem'),
      },
    ])
  )
  server.start()
  console.log('grpc server listening at port 5051')
}

main()
