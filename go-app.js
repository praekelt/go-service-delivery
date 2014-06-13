// WARNING: This is a generated file.
//          If you edit it you will be sad.
//          Edit src/app.js instead.

var go = {};
go;

go.app = function() {
    var vumigo = require('vumigo_v02');
    var App = vumigo.App;
    var Choice = vumigo.states.Choice;
    var ChoiceState = vumigo.states.ChoiceState;
    var EndState = vumigo.states.EndState;
	var FreeText = vumigo.states.FreeText;

    var GoApp = App.extend(function(self) {
        App.call(self, 'states:start');

        self.init = function(){
            return self.im.contacts.for_user().then(function(contact){
                self.contact = contact;
            });
        };

        self.states.add('states:start', function(name) {
            return new ChoiceState(name, {
                question: 'Choose your category?',

                choices: [
                    new Choice('states:electricity', 'Electricity'),
                    new Choice('states:water', 'Water'),
                    new Choice('states:sanitation', 'Sanitation'),
                    new Choice('states:other', 'Other'),
                    new Choice('states:end', 'Exit')],

                next: function(choice) {
                    return choice.value;
                }
            });
        });

        self.states.add('states:electricity', function(name){
            return new FreeText(name,{
                question: 'Enter your electricity problem',
                next: function(content){

                    self.contact.extra.electricity = content;

                    return self.im.contacts.save(self.contact).then(function(){
                        return "states:end";
                    });
                }
            });
        });

        self.states.add('states:water', function(name){
            return new FreeText(name,{
                question: 'Enter your water problem',
                next: function(content){

                    self.contact.extra.water = content;

                    return self.im.contacts.save(self.contact).then(function(){
                        return "states:end";
                    });
                }
            });
        });

        self.states.add('states:sanitation', function(name){
            return new FreeText(name,{
                question: 'Enter your sanitation problem',
                next: function(content){

                    self.contact.extra.sanitation = content;

                    return self.im.contacts.save(self.contact).then(function(){
                        return "states:end";
                    });
                }
            });
        });

        self.states.add('states:other', function(name){
            return new FreeText(name,{
                question: 'Enter your other problem',
                next: function(content){

                    self.contact.extra.other = content;

                    return self.im.contacts.save(self.contact).then(function(){
                        return "states:end";
                    });
                }
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
go.init = function() {
    var vumigo = require('vumigo_v02');
    var InteractionMachine = vumigo.InteractionMachine;
    var GoApp = go.app.GoApp;


    return {
        im: new InteractionMachine(api, new GoApp())
    };
}();
