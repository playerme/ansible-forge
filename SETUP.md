So you want to develop a Forge?

Things you need:
	
- rethinkdb (get it from brew)

- node (I used v4.2.1, but any version 0.12 and up will do.) 

- gulp-cli

- ansible

- ansible playbook repo

Things you need to run:

- `npm install` or `ied install`

  + if you use IED, `ied run ied`

- `gulp js:build`

- `rethinkdb` in the project directory

- `npm run db:initialize -- --dev`

- `npm start`

- `gulp`