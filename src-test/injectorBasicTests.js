module("Injector basic"); 

test("Injector exists", function() {
	ok(Injector, "Injector esist");
	equal(Injector, I, "Injector must be equals with I");
});

test("Injector internal classes", function() {
	ok(typeof(JadiInjector) == "undefined" , "JadiInjector must not esist");
});


test("Injector basic functions", function() {
	ok(Injector.inject, "Injector must have inject method");
});




// test("a basic test example", function() {
	// ok(true, "this test is fine");
	// var value = "hello";
	// equal(value, "hello", "We expect value to be hello");
// });
// module("Module A");
// 
// test("first test within module", function() {
	// ok(true, "all pass");
// });
// test("second test within module", function() {
	// ok(true, "all pass");
// });
// module("Module B");
// 
// test("some other test", function() {
	// expect(2);
	// equal(true, false, "failing test");
	// equal(true, true, "passing test");
// });
