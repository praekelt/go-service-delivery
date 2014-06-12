var assert = require('assert');
var vumigo = require('vumigo_v02');
var fixtures = require('./fixtures');
var AppTester = vumigo.AppTester;



describe("app", function() {
    describe("GoApp", function() {
        var app;
        var tester;

        beforeEach(function() {
            app = new go.app.GoApp();

            tester = new AppTester(app);

            tester
                .setup.config.app({
                    name: 'test_app'
                })
                .setup(function(api) {
                    fixtures().forEach(api.http.fixtures.add);
                });
        });

        describe("when the user starts a session", function() {
            it("should ask them to choose their category", function() {
                return tester
                    .start()
                    .check.interaction({
                        state: 'states:start',
                        reply: [
                            'Choose your category?',
                            '1. Electricity',
                            '2. Water',
                            '3. Sanitation',
                            '4. Other',
                            '5. Exit'
                        ].join('\n')
                    })
                    .run();
            });
        });

        describe("when the user selects electricity", function() {
            it("should ask them to enter their electricity problem", function() {
                return tester
                    .setup.user.state('states:start')
                    .input('1')
                    .check.interaction({

                        state: 'states:electricity',
                        reply:'Enter your electricity problem'
                    })
                    .run();
            });
        });

        describe("when the user selects water", function(){
            it("should ask them to enter their water problem", function(){
                return tester
                    .setup.user.state('states:start')
                    .input('2')
                    .check.interaction({

                        state: 'states:water',
                        reply: 'Enter your water problem'
                     })
                     .run();
            });
        });

        describe("when the user selects sanitation", function(){
            it("should ask them to enter their sanitation problem", function(){
                return tester
                    .setup.user.state('states:start')
                    .input('3')
                    .check.interaction({

                        state: 'states:sanitation',
                        reply: 'Enter your sanitation problem'
                    })
                    .run();
            });
        });

        describe("when the user selects other", function(){
            it("should ask them to enter their other problem", function(){
                return tester
                    .setup.user.state('states:start')
                    .input('4')
                    .check.interaction({

                        state: 'states:other',
                        reply: 'Enter your other problem'
                    })
                    .run();
            });
        });

        describe("when user enters their electricity problem", function(){
            it("should save user contacts", function(){
                return tester
                    .setup.user.state('states:electricity')
                    .input('light')
                    .check(function(api){

                        var contact = api.contacts.store[0];
                        assert.equal(contact.extra.electricity, 'light' );
                     })
                    .run();
             });

            it("should move users to the end state", function(){
                return tester
                    .setup.user.state('states:electricity')
                    .input('delivery report')
                    .check.interaction({
                        state: 'states:end',
                        reply: 'Thanks, cheers!'
                    })
                   .run();
            });
        });

        describe("when user enters their water problem", function(){
            it("should save user contacts", function(){
                return tester
                .setup.user.state('states:water')
                .input('pipe')
                .check(function(api){

                    var contact = api.contacts.store[0];
                    assert.equal(contact.extra.water, 'pipe');
                })
                .run();
            });

            it("should move users to the end state", function(){
                return tester
                    .setup.user.state('states:electricity')
                    .input('delivery report')
                    .check.interaction({
                        state: 'states:end',
                        reply: 'Thanks, cheers!'
                    })
                    .run();
            });
        });

        describe("when user enters their sanitation problem", function(){
            it("should save user contacts", function(){
                return tester
                .setup.user.state('states:sanitation')
                .input('block-age')
                .check(function(api){

                    var contact = api.contacts.store[0];
                    assert.equal(contact.extra.sanitation, 'block-age');
                })
                .run();
            });

            it("should move users to the end state", function(){
                return tester
                    .setup.user.state('states:sanitation')
                    .input('blockage report')
                    .check.interaction({
                        state: 'states:end',
                        reply: 'Thanks, cheers!'
                    })
                    .run();
            });
        });

        describe("when user enters their other problem", function(){
            it("should save user contacts", function(){
                return tester
                .setup.user.state('states:other')
                .input('other-problem')
                .check(function(api){

                    var contact = api.contacts.store[0];
                    assert.equal(contact.extra.other, 'other-problem');
                })
                .run();
            });

            it("should move users to the end state", function(){
                return tester
                    .setup.user.state('states:other')
                    .input('blockage report')
                    .check.interaction({
                        state: 'states:end',
                        reply: 'Thanks, cheers!'
                    })
                    .run();
            });
        });

        describe("when the user asks to exit", function() {
            it("should say thank you and end the session", function() {
                return tester
                    .setup.user.state('states:start')
                    .input('5')
                    .check.interaction({
                        state: 'states:end',
                        reply: 'Thanks, cheers!'
                    })
                    .check.reply.ends_session()
                    .run();
            });
        });
    });
});