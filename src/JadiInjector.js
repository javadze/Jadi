I = Injector = (function() {
	
	var Chain = function() {};
	
	Chain.prototype = {
		
		chain: function(fn){
			this.chains = this.chains || [];
			this.chains.push(fn);
			return this;
		},
	
		callChain: function(args) {
			if (this.chains && this.chains.length) {
				var currentChainElement = this.chains[0];
				this.chains.splice(0,1);
				currentChainElement.apply(this, args);
			}
		},
	
		clearChain: function() {
			this.chains = [];
		}
		
	};
	
	var Injector = function() {
		
	};
	
	Injector.prototype = {
		
		inject: function(module) {
			
			return this;
		},
		
		reject: function(module) {
			
			return this;
		},
		
		getInstance: function() {
			
			return null;
		}
		
	};
	
	var ModuleBuilder = function() {
		
	};
	
	ModuleBuilder.prototype = {
		
	};
	
	return new Injector();
	
})();
