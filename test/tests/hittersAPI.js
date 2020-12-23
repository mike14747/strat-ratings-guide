const app = require('../../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();

describe('Users API (/api/hitters/:year)', function () {
    it('should GET all hitters from the year 2019', function (done) {
        requester
            .get('/api/hitters/2019')
            .then((response) => {
                response.should.have.status(200);
                response.body.should.be.a('array').and.have.lengthOf.at.least(1);
                response.body.forEach(function (element) {
                    // console.log(element);
                    element.should.be.an('object').and.have.all.keys(
                        'h_year',
                        'real_team',
                        'hitter_name',
                        'bats',
                        'injury',
                        'ab',
                        'so_v_l',
                        'bb_v_l',
                        'hit_v_l',
                        'ob_v_l',
                        'tb_v_l',
                        'hr_v_l',
                        'w_v_l',
                        'dp_v_l',
                        'wops_v_l',
                        'so_v_r',
                        'bb_v_r',
                        'hit_v_r',
                        'ob_v_r',
                        'tb_v_r',
                        'hr_v_r',
                        'w_v_r',
                        'dp_v_r',
                        'wops_v_r',
                        'stealing',
                        'spd',
                        'bunt',
                        'h_r',
                        'd_ca',
                        'd_1b',
                        'd_2b',
                        'd_3b',
                        'd_ss',
                        'd_lf',
                        'd_cf',
                        'd_rf',
                        'fielding',
                        'rml_team_name',
                    );
                    element.h_year.should.be.a('number').and.to.equal(2019);
                    element.real_team.should.be.a('string').and.have.lengthOf.at.least(2);
                    element.hitter_name.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.bats.should.be.a('string').and.have.lengthOf(1);
                    element.injury.should.be.an('string').and.have.lengthOf.within(0, 1);
                    element.ab.should.be.a('number').and.to.be.at.least(1);
                    element.so_v_l.should.be.a('number').and.to.be.at.least(0);
                    element.bb_v_l.should.be.a('number').and.to.be.at.least(0);
                    element.hit_v_l.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.ob_v_l.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.tb_v_l.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.hr_v_l.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.w_v_l.should.be.a('string').and.have.lengthOf.within(0, 3);
                    element.dp_v_l.should.be.a('number').and.to.be.at.least(0);
                    element.wops_v_l.should.be.a('string');
                    element.so_v_r.should.be.a('number').and.to.be.at.least(0);
                    element.bb_v_r.should.be.a('number').and.to.be.at.least(0);
                    element.hit_v_r.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.ob_v_r.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.tb_v_r.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.hr_v_r.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.w_v_r.should.be.a('string').and.have.lengthOf.within(0, 3);
                    element.dp_v_r.should.be.a('number').and.to.be.at.least(0);
                    element.wops_v_r.should.be.a('string');
                    element.stealing.should.be.a('string').and.have.lengthOf.at.least(1);
                    element.spd.should.be.a('number').and.to.be.within(8, 17);
                    element.bunt.should.be.a('string').and.to.be.oneOf(['A', 'B', 'C', 'D']);
                    element.h_r.should.be.a('string').and.to.be.oneOf(['A', 'B', 'C', 'D']);
                    element.d_ca.should.be.a('string').and.have.lengthOf.within(0, 4);
                    element.d_1b.should.be.a('string').and.have.lengthOf.within(0, 4);
                    element.d_2b.should.be.a('string').and.have.lengthOf.within(0, 4);
                    element.d_3b.should.be.a('string').and.have.lengthOf.within(0, 4);
                    element.d_ss.should.be.a('string').and.have.lengthOf.within(0, 4);
                    element.d_lf.should.be.a('string').and.have.lengthOf.within(0, 4);
                    element.d_cf.should.be.a('string').and.have.lengthOf.within(0, 4);
                    element.d_rf.should.be.a('string').and.have.lengthOf.within(0, 4);
                    element.fielding.should.be.a('string');
                    element.rml_team_name.should.be.a('string');
                });
                done();
            })
            .catch((error) => done(error));
    });

    // another 'it' test goes here using 'requester'

    after(function (done) {
        requester.close();
        done();
    });
});