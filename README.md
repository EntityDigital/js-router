js-router
=========

A URL Router written in javascript, suitable for use in Node.js and (eventually) the browser.

Usage
-----

Clone the repository and then `npm install`

### Examples

#### Simple
```js
var Route = require('./route.js');
var index = new Route('/');
console.log(index.resolve('/'));
// returns {}
```

#### Define parameters
```js
var blogPost = new Route('/blog/:title');

console.log(blogPost.index.resolve('/blog/An-Imaginative-Blog-Post'));
// returns {title: 'An-Imaginative-Blog-Post'}
```

#### Optional parameters
```js
var blogPost = new Route('/blog/:title(/page/:page)');

console.log(blogPost.index.resolve('/blog/An-Imaginative-Blog-Post'));
// returns {title: 'An-Imaginative-Blog-Post'}

console.log(blogPost.index.resolve('/blog/An-Imaginative-Blog-Post/page/1'));
// returns {title: 'An-Imaginative-Blog-Post', page: '1'}
```

Optional parameters can be nested to any level

```js
var search = new Route('/find(/:start(-to-:end))', {
  'start': /\d{2}:\d{2}/,
  'end':   /\d{2}:\d{2}/
}, {
  'start': '00:00',
  'end':   '23:59'
});

console.log(search.resolve('/find'));
// returns {start: '00:00', end: '23:59'}

console.log(search.resolve('/find/08:00'));
// returns {start: '08:00', end: '23:59'}

console.log(search.resolve('/find/09:00-to-17:00'));
// returns {start: '09:00', end: '17:00'}
```

#### Validation rules
```js
var book = new Route('/:title/:isbn13', {
  'isbn13': /\d{13}/
});

console.log(book.resolve('/Nineteen-Eighty-Four/9780141393049'));
// returns {title: 'Nineteen-Eighty-Four', isbn13: '9780141393049'}

console.log(book.resolve('/Nineteen-Eighty-Four/123'));
// returns false
```

#### Default parameter values
```js
var blogPost = new Route('/blog/:title(/page/:page)', {page: /\d+/}, {page: 1});

console.log(blogPost.index.resolve('/blog/An-Imaginative-Blog-Post'));
// returns {title: 'An-Imaginative-Blog-Post', page: '1'}

console.log(blogPost.index.resolve('/blog/An-Imaginative-Blog-Post/page/3'));
// returns {title: 'An-Imaginative-Blog-Post', page: '3'}
```

#### Reversing
```js
var book = new Route('/:title/:isbn13', {
  'isbn13': /\d{13}/
});

console.log(book.reverse({
  title:  'Nineteen-Eighty-Four',
  isbn13: '9780141393049'
}));
// returns /Nineteen-Eighty-Four/9780141393049
```

__Note:__ `Route.reverse()` also performs validation

```js
console.log(book.reverse({
  title:  'Nineteen-Eighty-Four',
  isbn13: '123'
}));
// returns false
```
