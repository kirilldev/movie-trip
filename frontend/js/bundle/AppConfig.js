module.exports = function ($provide, $logProvider, $locationProvider) {
    'ngInject';

    $provide.decorator('$exceptionHandler', function ($delegate) {
        'ngInject';

        return function (exception, cause) {
            //TODO: send error to a server and maybe to show a user and error
            $delegate(exception, cause);
        }
    });

    $logProvider.debugEnabled(true); //TODO: disable it in prod.

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
};