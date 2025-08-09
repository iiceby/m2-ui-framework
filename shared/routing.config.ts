export class RoutingConfig {
    public static readonly routes = {
        auth: {
            route: 'auth',
            fullUrl: '/auth',
            registration: {
                route: 'registration',
                fullUrl: '/auth/registration'
            },
            resetPassword: {
                route: 'reset-password',
                fullUrl: '/auth/reset-password'
            }
        },
        home: {
            route: 'home',
            fullUrl: '/home'
        },
        version: {
            route: 'version',
            fullUrl: '/version',
            icons: {
                route: 'icons',
                fullUrl: '/version/icons'
            },
            styling: {
                route: 'styling',
                fullUrl: '/version/styling'
            }
        },
        errors: {
            route: 'errors',
            fullUrl: '/errors'
        }
    };
}
