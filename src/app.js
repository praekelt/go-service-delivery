go.app = function() {
    var vumigo = require('vumigo_v02');
    var App = vumigo.App;
    var Choice = vumigo.states.Choice;
    var ChoiceState = vumigo.states.ChoiceState;
    var EndState = vumigo.states.EndState;
	var FreeText = vumigo.states.FreeText;

    var GoApp = App.extend(function(self) {
        App.call(self, 'states:start');

        self.states.add('states:start', function(name) {
            return new ChoiceState(name, {
                question: 'Choose your category?',

                choices: [
                    new Choice('states:electricity', 'Electricity'),
                    new Choice('states:end', 'Exit')],

                next: function(choice) {
                    return choice.value;
                }
            });
        });
		
		self.states.add('states:electricity', function(name){
			return new FreeText(name,{
				question: 'Enter your electricity problem',
				next: 'states:end'

			});
		});

        self.states.add('states:end', function(name) {
            return new EndState(name, {
                text: 'Thanks, cheers!',
                next: 'states:start'
            });
        });
    });

    return {
        GoApp: GoApp
    };
}();
