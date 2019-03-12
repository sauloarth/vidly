const request = require('supertest');
const { Genre } = require('../../../models/genre');
const { User } = require('../../../models/user');
let server;

describe('/api/genres', () => {
    beforeEach(() => server = require('../../../index'));
    afterEach(async() => {
        server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async() => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ])
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    })

    describe('GET /:id', function() {
        it('should return a genre if a valid id is passed', async() => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save()

            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        })
    })

    describe('GET /:id', function() {
        it('should return 404 if an invaalid id is passed', async() => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        })
    })

    describe('POST /', function() {
        let token;
        let name;

        //happines path
        const exec = async() => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
        })

        it('should return 401 if client is not logged in', async() => {
            token = ''; //get rid of token
            const res = await exec();
            expect(res.status).toBe(401);
        })

        it('should return 400 if genre is less than 3 characters', async() => {
            name = 'ab' //name with less than 5 characters
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('should return 400 if genre is greater than 50 characters', async() => {
            name = Array(52).join('a'); //set name with 51 characters.
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('should save genre if value is valid and user is logged', async() => {
            const res = await exec();
            const genre = await Genre.find({ name: 'genre1' });
            expect(genre).not.toBeNull();
        })

        it('should save genre if value is valid and user is logged', async() => {
            const res = await exec();
            const genre = await Genre.find({ name: 'genre1' });
            expect(genre).not.toBeNull();
        })

        it('should return saved genre if it is valid', async() => {
            name = 'genre1';
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        })

    })
});