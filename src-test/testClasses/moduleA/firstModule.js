namespace.FirstModule = function() {
	
	this.submodules = [
		namespace.SecondModule,
		namespace.ThirdModule
	];
	
};

namespace.FirstModule.prototype = {
	
	configure: function() {
		bind()		
	}
	
};
