const app = require('../../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();
const fs = require('fs');
const path = require('path');

chai.Assertion.addMethod('numberOrNull', function (prop = 'Unspecified property') {
    typeof this._obj === 'number' || this._obj === null ? this.assert(true) : this.assert(false, `${prop} should be a number or null`);
});

describe('Users API (/api/pitchers/:year)', function () {
    it('should FAIL to POST pitcher data from "/test/testData/pitcher_ratings.csv" because the Year field is missing', function (done) {
        requester
            .post('/api/pitchers')
            .attach('file', fs.readFileSync(path.join(__dirname, '../testData/pitcher_ratings.csv')))
            .then((response) => {
                response.should.have.status(400);
                response.body.should.be.an('object').and.have.all.keys('message');
                done();
            })
            .catch((error) => done(error));
    });

    it('should POST pitcher data from "/data/pitcher_ratings.csv"', function (done) {
        requester
            .post('/api/pitchers')
            .attach('file', fs.readFileSync(path.join(__dirname, '../../data/pitcher_ratings.csv')))
            .then((response) => {
                response.should.have.status(201);
                response.body.should.be.an('object').and.have.all.keys('message', 'added');
                response.body.added.should.be.a('number').and.at.least(1);
                done();
            })
            .catch((error) => done(error));
    });

    it('should try to GET all pitchers from the year 1899 and return an empty array', function (done) {
        requester
            .get('/api/pitchers/1899')
            .then((response) => {
                response.should.have.status(200);
                response.body.should.be.a('array').and.have.lengthOf(0);
                done();
            })
            .catch((error) => done(error));
    });

    it('should GET all pitchers from the year 2019', function (done) {
        requester
            .get('/api/pitchers/2019')
            .then((response) => {
                response.should.have.status(200);
                response.body.should.be.a('array').and.have.lengthOf.at.least(1);
                response.body.forEach(function (element) {
                    // console.log(element);
                    element.should.be.an('object').and.have.all.keys(
                        'p_year',
                        'real_team',
                        'pitcher_name',
                        'throws',
                        'ip',
                        'so_v_l',
                        'bb_v_l',
                        'hit_v_l',
                        'ob_v_l',
                        'tb_v_l',
                        'hr_v_l',
                        'bp_v_l',
                        'dp_v_l',
                        'wops_v_l',
                        'so_v_r',
                        'bb_v_r',
                        'hit_v_r',
                        'ob_v_r',
                        'tb_v_r',
                        'hr_v_r',
                        'bp_v_r',
                        'dp_v_r',
                        'wops_v_r',
                        'hold',
                        'endurance',
                        'fielding',
                        'balk',
                        'wp',
                        'batting_b',
                        'stl',
                        'spd',
                        'rml_team_name',
                    );
                    element.p_year.should.be.a('number').and.to.equal(2019);
                    element.real_team.should.be.a('string').and.have.lengthOf.at.least(2);
                    element.pitcher_name.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.throws.should.be.a('string').and.have.lengthOf(1);
                    element.ip.should.be.a('number').and.to.be.at.least(1);
                    element.so_v_l.should.be.a('number').and.to.be.at.least(0);
                    element.bb_v_l.should.be.a('number').and.to.be.at.least(0);
                    element.hit_v_l.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.ob_v_l.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.tb_v_l.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.hr_v_l.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.bp_v_l.should.be.a('string').and.have.lengthOf.within(0, 3);
                    element.dp_v_l.should.be.a('number').and.to.be.at.least(0);
                    element.wops_v_l.should.be.a('string');
                    element.so_v_r.should.be.a('number').and.to.be.at.least(0);
                    element.bb_v_r.should.be.a('number').and.to.be.at.least(0);
                    element.hit_v_r.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.ob_v_r.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.tb_v_r.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.hr_v_r.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.bp_v_r.should.be.a('string').and.have.lengthOf.within(0, 3);
                    element.dp_v_r.should.be.a('number').and.to.be.at.least(0);
                    element.wops_v_r.should.be.a('string');
                    element.hold.should.be.a('number').and.to.be.within(-6, 9);
                    element.endurance.should.be.a('string').and.have.lengthOf.at.least(4);
                    element.fielding.should.be.a('string');
                    element.balk.should.be.a('number').and.to.be.within(0, 20);
                    element.wp.should.be.a('number').and.to.be.within(0, 20);
                    element.batting_b.should.be.a('string').and.have.lengthOf(5);
                    element.stl.should.be.a('string').and.have.lengthOf(1);
                    element.spd.should.be.a('number').and.to.be.within(8, 17);
                    element.rml_team_name.should.be.a('string');
                });
                done();
            })
            .catch((error) => done(error));
    });

    after(function (done) {
        requester.close();
        done();
    });
});