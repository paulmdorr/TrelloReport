$(document).ready(function() {
var authenticationSuccess = function() { console.log('Successful authentication'); };
  var authenticationFailure = function() { console.log('Failed authentication'); };

  Trello.authorize({
    type: 'redirect',
    name: 'Getting Started Application',
    scope: {
        read: 'true',
        write: 'true' },
    expiration: 'never',
    success: authenticationSuccess,
    error: authenticationFailure
  });
});