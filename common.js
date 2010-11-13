// JavaScript: The Good Parts by Douglas Crockford.
// p. 4: Throughout the book, a method method is used to define new
// methods
// p. 33: We no longer have to type the name of the prototype
// property. That bit of ugliness can now be hidden.
Function.prototype.method = function (name,func) {
  this.prototype[name] = func;
  return this;
}
// http://javascript.crockford.com/prototypal.html
//Prototypal Inheritance in JavaScript by Douglas Crockford
// 2008-04-07 I now prefer this formulation:
// Also
// JavaScript: The Good Parts by Douglas Crockford.
// p. 22: Add a create method to the Object function.
// The create method creates a new object that uses an old object as
// its prototype.
if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}
// newObject = Object.create(oldObject);
