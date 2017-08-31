var http = require('http');

http.createServer(function(req, res) {
  console.log(typeof(req));
  console.log(typeof(res));
  res.end('Hello');
  process.exit();
}).listen(3030);


var r = require('./router.js'),
    Route = require('./route.js');

r.add('get', 'index', '/', function(p) {
  console.log(p);
});

r.add(['get', 'post'], 'test', new Route('/:id(/:view)', {}, {view: 'full'}), function(p) {
  console.log(p);
});

r.resolve('get', '/');
r.resolve('get', '/123');
r.resolve('get', '/123/partial');
r.resolve('post', '/123/full');
r.resolve('delete', '/123/full');

console.log(r.reverse('get', 'index'));
console.log(r.reverse('get', 'test', {id: 123}));
console.log(r.reverse('get', 'test', {id: 123, view: 'partial'}));