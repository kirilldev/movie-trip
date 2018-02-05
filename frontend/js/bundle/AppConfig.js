module.exports = function ($provide,
                           $logProvider,
                           $locationProvider) {
    'ngInject';

    $provide.decorator('$exceptionHandler', function ($delegate, $injector) {
        'ngInject';

        return function (exception, cause) {
            $injector.get('$location').path('/error');
            $delegate(exception, cause);
        }
    });

    $logProvider.debugEnabled(true);

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
};