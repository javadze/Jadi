Injector = (function() {
	
	I = function(name) {
		return name ? this.getInstanceByName(name) : this.getInjector();
	};
	
	I.prototype = {
		
		getInstanceByName: function(name) {
			var instance = Injector.instances[name];
			if (!instance)
				throw new Error('Injector has no instances with name = ' + name);
			return instance; 
		},
		
		getInjector: function() {
			return Injector;
		}
		
	};
	
	var Chain = function() {
		
	};
	
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
	
	Injector = function() {
		
		this.moduleBuilder = new ModuleBuilder();
		
		this.instances = {};
		
	};
	
	Injector.prototype = {
		
		inject: function(object, callback) {
			this.injectModule(object, callback);
		},
		
		reject: function(object, callback) {
			this.rejectModule(object, callback);
		},
		
		injectModule: function(module, callback) {
			this.moduleBuilder.buildModule(module, callback);
		},
		
		rejectModule: function(module, callbakc) {
			this.moduleBuilder.unbuildModule(module, callback);
		},
		
		provide: function(object) {
			if (object) {
				for (var name in object.global) 
			    	if (object.global[name] == object) this.provideForName(object, name); 
			} else {
				throw new Error("Injector can't provide undefined or null object");
			}
		},
		
		provideForName: function(object, name) {
			if (!this.instances[name]) {
				this.instances[name] = object;
			} else {
				throw new Error("Injector already have object with name: " + name);
			}
		},
		
		unprovide: function(name) {
			this.instances[name] = null;
		}
		
	};
	
	ModuleBuilder = function() {
		
		this.injectedModules = [];
		
		this.modulesChain = new Chain();
		
	};
	
	ModuleBuilder.prototype = {
		
		buildModule: function(module, callback) {
			var chain = this._constructModulesChain(module);
			if (callback) chain.chain(callback);
			chain.callChain();
		},
		
		unbuildModule: function(module, callback) {
			var chain = this._constructDeinitializationChain(module);
			if (callback) chain.chain(callback);
			chain.callChain();
		},
		
		isModuleInjected: function(module) {
			for (var i = 0; this.injectedModules.length; i++) {
				if (this.injectedModules[i] == module) 
					return true;
			}
			return false;
		},
		
		_constructModulesChain: function(module) {
			if (!this.isModuleInjected(module)) {
				this._initRequiredModules(module);
				this._initModule(module);
			}
			return this.modulesChain;
		},
		
		_constructDeinitializationChain: function(module) {
			if (this.isModuleInjected(module)) {
				var moduleInstance = new module();
				this._deinitModule(moduleInstance);
			}
			return this.modulesChain;
		},
		
		_initRequiredModules: function(module) {
			var modules = module.prototype.requiredModules;
			if (modules) {
				for (var i = 0; i < modules.length; i++) 
					this._constructModulesChain(modules[i]);
			}
		},
		
		_initModule: function(module) {
			var self = this;
			this.modulesChain.chain(function() {
				self._moduleInitialization.apply(self, [module]);
			});
		},
		
		_deinitModule: function(moduleInstance) {
			var self = this;
			this.modulesChain.chain(function() {
				self._moduleDeinitialization.apply(self, [moduleInstance]);
			});
		},

		_moduleInitialization: function(module) {
			this._injectProvidedInstances(module.prototype.provide);
			this._injectSubmodules(module.prototype.submodules);
			
			var self = this;
			if (module.prototype.defaultInitialization) {
				var moduleInstance = new module();
				this.modulesChain.callChain();
			} else {
				var moduleInstance = new module(function() {
					self.modulesChain.callChain();
				});
			}
		},
		
		_moduleDeinitialization: function(moduleInstance, callback) {
			this._rejectProvidedInstances(moduleInstance.provide);
			this._rejectSubmodules(moduleInstance.submodules);
			if (moduleInstance.deinit) moduleInstance.deinit(callback); 
		},
		
		_injectProvidedInstances: function(provide) {
			if (provide) {
				var provided = provide();
				for (var name in provided)
					Injector.provideForName(provided[name], name);
			}
		},
		
		_rejectProvidedInstances: function(provide) {
			if (provide.provide)
				for (var name in provide.provide)
					Injector.unprovide(name);
		},
		
		_injectSubmodules: function(submodules) {
			if (submodules) 
				for (var i = 0; i < submodules.length; i++) 
					Injector.inject(submodules[i]);
		},
		
		_rejectSubmodules: function(submodules) {
			if (submodules) 
				for (var i = 0; i < submodules.length; i++) 
					Injector.reject(submodules[i]);
		}
		
	};
	
	return new Injector();

})();

