This is a quick script that ingest a JSON file exported from MongoDB using mongoexport utility into Elastic Search.

Example:
mongoexport -d <db> -c <col> | node.io ingestor.js

Tested with MongoDB 2.4.2 and Elastic Search 0.90.5.
