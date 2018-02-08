module.exports = function ($provide, $logProvider, $locationProvider) {
    'ngInject';

    $provide.decorator('$exceptionHandler', function ($delegate) {
        'ngInject';

        return function (exception, cause) {
            //TODO: send error to a server and maybe show it to a user
            $delegate(exception, cause);
        };
    });

    $logProvider.debugEnabled(true); //TODO: disable it in prod.

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
};