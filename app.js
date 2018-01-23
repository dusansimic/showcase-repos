const micro = require('micro');
const got = require('got');

const server = micro(async req => {
	const data = await micro.json(req);
	const reqBody = {query: `query {
		user(login:"${data.username}") {
			repositories(orderBy:{direction: DESC, field: CREATED_AT}, first:6) {
				nodes {
					name
					description
					languages(orderBy:{direction: DESC, field: SIZE}, first:3) {
						nodes {
							name
							color
						}
					}
				}
			}
		}
	}`};
	const {body} = await got.post('https://api.github.com/graphql', {
		headers: {
			Authorization: 'bearer <your github token>',
			'content-length': JSON.stringify(reqBody).length
		},
		body: reqBody,
		json: true
	});
	return body;
});

server.listen(3000, '0.0.0.0', err => {
	if (err) {
		throw err;
	}

	console.log('Listening on port 3000');
});
