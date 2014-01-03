# pillowfork 

Pillowfork is an experiment in collaborative writing experiment, where anyone can create alternate branches of a narrative work. You might use it for:

 - Free-form writing in a crazy group brainstorm
 - Exploring concurrent events

## Fun stuff

 - Updates are shown immediately to all connected browsers, enabling realtime "story ping-pong".
 - Supports fully offline authoring and browsing, so you can take it with you to the park. Changes sync next time you get a connection.
 - Mobile-first. Works great on smartphones.

## Technical stuff

 - It is discoursive, which means that pages are immutable once they are published. This isn't enforced by the server, rather it is ensured by the fact that the page IDs are cryptographic hashes of their contents.
 - Built using CouchDB, PouchDB, and AngularJS

## Get involved

 - [Roadmap on Trello](https://trello.com/b/vGDutzqN/pillow-fork)

## Log

- Tests first
- Can I assign ID on server side based on content?
  - if yes, set on save
  - if not, set in client and validate on server
- How is validation of author info normally handled?

i prob need to switch to js couchapp
 - https://github.com/garbados/grunt-couchapp
 - https://github.com/jo/grunt-couch

