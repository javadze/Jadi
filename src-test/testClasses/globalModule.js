namespace = {};

namespace.GlobalModule = function() {
	
	this.submodules = [
		namespace.FirstModule,
		namespace.SecondModule,
		namespace.ThirdModule
	];
	
};

namespace.GlobalModule.prototype = {
	
	configure: function() {
		bind()		
	}
	
};