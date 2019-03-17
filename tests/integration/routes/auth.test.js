const request = require('supertest');
const { Genre } = require('../../../models/genre');
const { User } = require('../../../models/user');
let server;

describe('/api/auth', function() {
    beforeEach(() => { server = require('../../../index') })
    afterEach(async() => { server.close() })

    let token;
    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    }

    beforeEach(() => token = new User().generateAuthToken());

    describe('POST /', () => {
        it('should return a 401 if request has no token', async() => {
            token = ''; // simulate no passing token
            const res = await exec();
            expect(res.status).toBe(401);
        })
    })

    describe('POST /', () => {
        it('should return a 400 if token is invalid', async() => {
            token = 'a'; // simulate invalid token
            const res = await exec();
            expect(res.status).toBe(400);
        })
    })

    describe('POST /', () => {
        it('should return a 200 if a valid token is passed', async() => {
            //token is already defined.
            const res = await exec();
            expect(res.status).toBe(200);
        })
    })
})