# CreatorConnect Backend

REST API for the CreatorConnect influencer-brand collaboration platform.

## Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** (access + refresh token auth)
- **Cloudinary** (image / video uploads)
- **Multer** (file handling)

## Folder Structure

```
src/
├── controllers/
│   ├── user.controller.js        # Auth: register, login, logout, refresh token
│   ├── creator.controller.js     # Creator CRUD, search, portfolio, reviews, save
│   ├── collab.controller.js      # Collab requests between owners and creators
│   ├── message.controller.js     # Direct messaging
│   ├── tweet.controller.js       # Community posts
│   ├── comment.controller.js     # Comments on community posts
│   ├── like.controller.js        # Likes on community posts
│   ├── video.controller.js       # Portfolio video uploads
│   └── dashboard.controller.js   # Dashboard stats
├── db/
│   └── index.js                  # MongoDB connection
├── middlewares/
│   ├── authjs.middleware.js      # JWT verification + role guard
│   └── multer.middleware.js      # File upload config
├── models/
│   ├── user.model.js             # Shared auth user (creator + owner)
│   ├── creator.model.js          # Rich creator profile
│   ├── owner.model.js            # Brand owner profile
│   ├── collabRequest.model.js    # Collab requests
│   ├── message.model.js          # Direct messages
│   ├── tweet.model.js            # Community posts
│   ├── comment.model.js          # Post comments
│   ├── like.model.js             # Likes
│   ├── video.model.js            # Portfolio videos
│   ├── playlist.model.js         # Creator playlists
│   └── subscription.model.js     # Owner saves creators
├── routes/
│   ├── user.router.js
│   ├── creator.router.js
│   ├── collab.router.js
│   ├── message.router.js
│   ├── tweet.router.js
│   ├── comment.router.js
│   ├── like.router.js
│   ├── video.route.js
│   └── dashboard.router.js
├── utils/
│   ├── ApiErrors.js              # Custom error class
│   ├── ApiResponse.js            # Standard response wrapper
│   ├── asynHandler.js            # Async error forwarding
│   └── cloudinary.js             # Upload / delete helpers
├── app.js                        # Express app setup + routes
├── constants.js                  # App-wide constants
└── index.js                      # Entry point (DB connect + server start)
```

## Setup

```bash
cd creator-connect-backEnd
npm install
# copy .env and fill in your values
npm run dev
```

## API Endpoints

### Auth (`/api/v1/users`)
| Method | Path               | Description              |
|--------|--------------------|--------------------------|
| POST   | /register          | Register (creator/owner) |
| POST   | /login             | Login                    |
| POST   | /logout            | Logout (auth required)   |
| POST   | /refresh           | Refresh access token     |
| GET    | /me                | Get current user         |
| PATCH  | /update-account    | Update name/email        |
| PATCH  | /change-password   | Change password          |
| PATCH  | /avatar            | Update avatar            |

### Creators (`/api/v1/creators`)
| Method | Path                        | Description                    |
|--------|-----------------------------|--------------------------------|
| GET    | /                           | List all creators (filterable) |
| GET    | /search?q=...               | Search creators                |
| GET    | /slug/:slug                 | Public profile by slug         |
| GET    | /:creatorId                 | Profile by ID                  |
| GET    | /me/profile                 | My creator profile             |
| PATCH  | /me/profile                 | Update my profile              |
| PATCH  | /me/avatar                  | Update my avatar               |
| PATCH  | /me/cover                   | Update my cover image          |
| POST   | /me/portfolio               | Add portfolio item             |
| DELETE | /me/portfolio/:itemId       | Remove portfolio item          |
| POST   | /:creatorId/reviews         | Add review                     |
| POST   | /:creatorId/save            | Save/unsave a creator          |
| GET    | /owner/saved                | Get saved creators             |

### Collab Requests (`/api/v1/collab`)
| Method | Path                   | Description                |
|--------|------------------------|----------------------------|
| POST   | /                      | Send request (owner only)  |
| GET    | /owner                 | Owner's sent requests      |
| GET    | /creator               | Creator's received requests|
| GET    | /:requestId            | Request details            |
| PATCH  | /:requestId/status     | Accept / decline / complete|
| DELETE | /:requestId/cancel     | Cancel pending request     |

### Messages (`/api/v1/messages`)
| Method | Path                        | Description        |
|--------|-----------------------------|--------------------|
| POST   | /                           | Send message       |
| GET    | /contacts                   | Contact list       |
| GET    | /conversation/:userId       | Chat history       |
| DELETE | /:messageId                 | Delete message     |

### Community (`/api/v1/community`)
| Method | Path         | Description          |
|--------|--------------|----------------------|
| GET    | /            | Public feed          |
| GET    | /:tweetId    | Single post          |
| POST   | /            | Create post (auth)   |
| PATCH  | /:tweetId    | Edit post            |
| DELETE | /:tweetId    | Delete post          |

### Likes (`/api/v1/likes`)
| Method | Path              | Description         |
|--------|-------------------|---------------------|
| POST   | /tweet/:tweetId   | Toggle like on post |
| GET    | /posts            | My liked posts      |

### Comments (`/api/v1/comments`)
| Method | Path                   | Description         |
|--------|------------------------|---------------------|
| GET    | /tweet/:tweetId        | Get comments        |
| POST   | /tweet/:tweetId        | Add comment         |
| PATCH  | /:commentId            | Edit comment        |
| DELETE | /:commentId            | Delete comment      |

### Dashboard (`/api/v1/dashboard`)
| Method | Path      | Description              |
|--------|-----------|--------------------------|
| GET    | /creator  | Creator dashboard stats  |
| GET    | /owner    | Owner dashboard stats    |
| GET    | /global   | Global platform stats    |
