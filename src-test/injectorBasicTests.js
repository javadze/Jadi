module("Injector basic"); 

test("Basic requirements", function() {
	expect(3);
	ok(Injector, "Injector");
	ok(I, "Injector");
	equal(Injector, I, "Injector equals with I");
});

test("Basic functions", function() {
	expect(3);
	ok(Injector.inject, "Injector.inject()");
	ok(Injector.reject, "Injector.reject()");
	ok(Injector.getInstance, "Injector.getInstance()");
});


module("Single module injection");

FirstServiceClass = function() {
	
};

SecondServiceClass = function() {
	
};

var FirstModuleClass = function() {
	
};

FirstModuleClass.prototype = {
	
	configure: function() {
		bind('firstService').to(new FirstServiceClass());
		bind('secondService').to(new SecondServiceClass());
	}
	
};

var SecondModule = function() {
	
	submodules: [
		FirstModule
	]
	
};

SecondModule.prototype = {
	
	configure: function() {
		
	}
	
};

test("Module injection parameters", function() {
	expect(9);
	
	var clazz = FirstModuleClass;
	
	equal(Injector.inject(null), Injector, "inject() returns itself");
	equal(Injector.reject(null), Injector, "reject() returns itself");
	
	try {
		Injector.inject(clazz);
		ok(true, "Correct module injection");
	} catch (e) {
		ok(false, "Correct module injection");
	}
	
	try {
		Injector.reject(clazz);
		ok(true, "Correct module rejection");
	} catch (e) {
		ok(false, "Correct module rejection");
	}
	
	try {
		Injector.reject(clazz, clazz);
		ok(true, "Correct duplicated module rejection");
	} catch (e) {
		ok(false, "Correct duplicated module rejection");
	}
	
	try {
		Injector.inject(clazz).inject(clazz);
		ok(false, "Duplicate module injection");
	} catch (e) {
		Injector.reject(clazz);
		ok(true, "Duplicate module injection");
	}
	
	try {
		Injector.inject([clazz]);
		ok(true, "Correct array module injection");
	} catch (e) {
		Injector.reject(clazz);
		ok(false, "Correct array module injection");
	}
	
	try {
		Injector.inject([clazz, clazz]);
		ok(false, "Duplicate array module injection");
	} catch (e) {
		Injector.reject(clazz);
		ok(true, "Duplicate array module injection");
	}
	
	try {
		Injector.inject(clazz, clazz);
		ok(false, "Duplicate params module injection");
	} catch (e) {
		Injector.reject(clazz);
		ok(true, "Duplicate params module injection");
	}
	
});


test("Simple module configuration", function() {
	Injector.inject(FirstModuleClass);
	
	ok(Injector.getInstance('firstService'), "Get first service instance");
	ok(Injector.getInstance('secondService'), "Get second service instance");
	
});



	
	

