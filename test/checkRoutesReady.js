const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

describe('Test the hitter and pitcher routes', function () {
    const runTests = () => {
        require('./tests/hittersAPI');
        // require('./tests/pitchersAPI');
    };

    const checkRoutes = () => {
        it('should check and see if the API routes are ready', function (done) {
            chai.request(app)
                .get('/api/test')
                .end(function (error, response) {
                    if (error) done(error);
                    if (response.status === 200) runTests();
                    response.should.have.status(200);
                    done();
                });
        });
    };

    checkRoutes();
});
