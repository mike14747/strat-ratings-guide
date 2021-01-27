const app = require('../../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();
const fs = require('fs');
const path = require('path');

describe('Users API (/api/hitters/multi-team)', function () {
    it('should FAIL to POST multi-team hitter data from "/test/testData/multi_team_hitters.csv" because the Year field is missing', function (done) {
        requester
            .post('/api/hitters/multi-team')
            .attach('file', fs.readFileSync(path.join(__dirname, '../testData/multi_team_hitters.csv')))
            .then((response) => {
                response.should.have.status(400);
                response.body.should.be.an('object').and.have.all.keys('message');
                done();
            })
            .catch((error) => done(error));
    });

    it('should FAIL to POST multi-team hitter data from "/test/testData2/multi_team_hitters.csv" because a Tm field is invalid', function (done) {
        requester
            .post('/api/hitters/multi-team')
            .attach('file', fs.readFileSync(path.join(__dirname, '../testData2/multi_team_hitters.csv')))
            .then((response) => {
                response.should.have.status(400);
                response.body.should.be.an('object').and.have.all.keys('message');
                done();
            })
            .catch((error) => done(error));
    });

    it('should POST multi-team hitter data from "/data/multi_team_hitters.csv"', function (done) {
        requester
            .post('/api/hitters/multi-team')
            .attach('file', fs.readFileSync(path.join(__dirname, '../../data/multi_team_hitters.csv')))
            .then((response) => {
                response.should.have.status(201);
                response.body.should.be.an('object').and.have.all.keys('message', 'added');
                response.body.added.should.be.a('number').and.at.least(1);
                done();
            })
            .catch((error) => done(error));
    });

    after(function (done) {
        requester.close();
        done();
    });
});
