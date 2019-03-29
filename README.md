# MongoMart Stitch App

## Introduction

Example app for MongoDB Stitch to showcase Stitch's QueryAnywhere / Rules feature, which enables
RESTful APIs on top of MongoDB Atlas to easily query the data from other applications.

## Import data

Create a MongoDB cluster and import the data:
```bash
mongoimport --uri="mongodb+srv://USERNAME:PASSWORD@ATLAS_CLUSTER_NAME.mongodb.net/mongomart" -c reviews --file=data/reviews.json
mongoimport --uri="mongodb+srv://USERNAME:PASSWORD@ATLAS_CLUSTER_NAME.mongodb.net/mongomart" -c item --file=data/item.json
```

After importing the data, create a Stitch app and link it to the cluster that you have just imported 
the data to. For more information on how to create a Stitch app, see: 
https://docs.mongodb.com/stitch/procedures/create-stitch-app/

Once you have created the Stitch app, do the following:
- Turn on *Anonymous authentication* using the toggle of Step 2 on the *Getting Started* page.
- Using the navigation on the left, go to *Rules* and create the following rules:
  - On the *Rules* page, click on the ellipsis next to the name of your linked cluster, click *Add 
    Database/Collection*:
    - As database name use *mongomart*, as collection name use *item*, and as template select *Users 
      can only read all data*. Click *Add Collection*.
  - Add another rule:
    - As database name use *mongomart*, as collection name use *cart*, and as template select *Users 
      can only read and write their own data*. Click *Add Collection*.
  - Add one final rule:
    - As database name use *mongomart*, as collection name use *reviews*, and as template select 
      *Users can read all data, but only write their own data*. Click *Add Collection*.

Finally, copy the App ID that is displayed on the top left of the screen. This app ID needs to be 
used by the front-end application in the next step.

## Install and run app

The application is built using React. To install and run the application NPM or Yarn is required.

First, update the Stitch App ID in the application by editing `src/index.js` and replacing 
*YOUR_STITCH_APP_ID* on line 12 with your Stitch App ID.

To install and run the application:

```bash
$ npm install
$ npm start
```

You should now be able to view the application by opening [http://localhost:3000](http://localhost:3000) 
in the browser.