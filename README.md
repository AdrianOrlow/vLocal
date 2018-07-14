# vLocal

### vLocal is the simple local offers/ads system made with VueJS, NodeJS and Firebase.

Project demo is available at: http://bit.ly/vLocal

# Getting started

This app is built using [vue-cli webpack](https://github.com/vuejs-templates/webpack), so to get started first you have to do is:

```bash
# install dependencies
> npm install
```

After installing dependencies, you'll need to setup connection with Firebase. To do this, [create Firebase project](https://console.firebase.google.com/), copy app config (make sure you have all fields filled) and paste it in App.vue file, then turn on email/password and Facebook authentication, next setup database:

### Database structure

```
XXX
  |
  |- chats
  |      |- CHAT_KEY
  |      |    |- messages
  |      |     |    |
  |      |     |    |- MESSAGE_ID
  |      |     |    |    |- text
  |      |     |    |    |- uid
  |      |     |    ...
  |      |     ...
  |      ...
  |
  |- offers
  |      |- OFFER_ID
  |      |    |- authoruid
  |      |    |- date
  |      |    |- desc
  |      |    |- img
  |      |    |- isvalid
  |      |    |- local
  |      |    |- price
  |      |    |- title
  |      ...
  |
  |- users
         |- USER_ID
         |    |- name
         |    |- phone
         |    |- city
         |    |- profileimg
         |    |- isonline
         |    |- conversators
         |        |- USER_ID
         ...      ...
```

### Rules

```
// Database
{
  "rules": {
    ".read": true,
    "chats": {
    	".write": "!data.exists()",
      ".read": "root.child('users').child(auth.uid).child('isonline').val() == true"
    },
    "offers": {
      "$oid": {
        ".write": "newData.child('authoruid').val() === auth.uid"
      },
      ".write": "!data.exists() && newData.child('authoruid').val() === auth.uid",
      ".validate": "newData.hasChildren(['title', 'desc', 'price', 'local', 'date', 'img', 'isvalid', 'authoruid']) && newData.child('price').val().length < 19 && newData.child('local').val().length < 19 && newData.child('price').isNumber()"
    },
    "users": {
      "$uid": {
      	".write": "$uid === auth.uid",
        "conversators": {
          ".read": "$uid === auth.uid",
          ".write": true
        }
      }
    }
  }
}

// Storage
service firebase.storage {
  match /b/{bucket}/o {
  	match /profileimg/{imageId} {
      allow write: if request.resource.size < 5 * 1024 * 1024 // not larger than 5MB
                   && request.resource.contentType.matches('image/.*'); // only images
    }
    match /offerimg/{imageId} {
      allow write: if request.resource.size < 5 * 1024 * 1024 // not larger than 5MB
                   && request.resource.contentType.matches('image/.*'); // only images
    }
  }
}
```

Next run application:

```|
# serve with hot reload at localhost:8080/[your-local-ip]:8080
> npm run dev
```

Other commands available are:

```bash
# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run single unit tests
npm run unit

# run continous unit tests
npm run units

# run e2e tests
npm run e2e

# run all tests
npm test
```

# License

```
Copyright (c) 2018 Adrian Orłów

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
