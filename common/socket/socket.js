/**
 * Created by yartiles on 18/07/17.
 */

(function (skt) {
    skt.create = create;

    var socketAuthenticate = require('./socket-auth');
    var eventHandler = require('./event-handler');
    var endPoint = {
        all: '/v1/connect'
    };
    var sockets = {};

    function create(server) {
        var io = require('socket.io')(server, {
            handlePreflightRequest: (req, res) => {
                const headers = {
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    "Access-Control-Allow-Origin": req.headers.origin,
                    "Access-Control-Allow-Credentials": true
                };
                res.writeHead(200, headers);
                res.end();
            }
        });
        io.use(socketAuthenticate.authenticate);
        createSocketEndPoint(io);
    }

    function createSocketEndPoint(io) {
        var socketAll = undefined;
        socketAll = io.of(endPoint.all);
        socketAll.on('connection', function (socket) {

            console.log('\n\n\n\n\n\n\n//////////////////////////////////new socket connection: ')
            sockets[socket.request.user.id.toString()] = socket;
            // socket.join(socket.request.user.id.toString());
            socket.on('logout', function () {
                socket.disconnect();
                console.log('logout x', socket.request.user.id.toString());
                delete sockets[socket.request.user.id.toString()];
            });
            socket.on('disconnect', function () {
                console.log('desconectandose x', socket.request.user.id.toString());
                console.log('desconectandose x', socket.request.user.id.toString());
                delete sockets[socket.request.user.id.toString()];
            });


            socket.emit('notification', { a: 123 });


            socket.on('hola', function (data) {
                console.log(data)
                socket.broadcast.emit('hi');
                console.log("Hola del pepe")
                socket.emit('hola', { a: 123 });
            });
        });

        // eventHandler.on('checkUserActive', function (data) {
        //   data.isConnected = socketAll.adapter.rooms[data.id] != undefined;
        // });




        eventHandler.on('send-notification', function (info) {
            console.log("enviando notifiacion al", info.ReceiverId);
            if (sockets[info.ReceiverId.toString()]) {
                sockets[info.ReceiverId.toString()].emit('notification', info);
            }
        });



        //ESTO ES PARA NOTIFICAR A TODOS LOS USUARIOS
        // eventHandler.on('notification', function (data) {
        //   socketAll/*.to(data.ReceiverId.-toString())
        //    */.emit('notification-' + data.ReceiverId.toString(), data);
        // });
    }
})
    (module.exports);