### 🧩 1. Auth & User Management

| Purpose           | Method | Endpoint                | Access        | Notes                     |
| ----------------- | ------ | ----------------------- | ------------- | ------------------------- |
| Register new user | POST   | `/api/v1/auth/register` | Public        | Hash password, store user |
| Login user        | POST   | `/api/v1/auth/login`    | Public        | Return JWT token          |
| Get user profile  | GET    | `/api/v1/users/:id`     | Authenticated | View profile info         |
| Update profile    | PUT    | `/api/v1/users/:id`     | Owner/Admin   | Edit own info only        |
| Delete user       | DELETE | `/api/v1/users/:id`     | Admin         | Admin can remove users    |
| Logout user       | POST   | `/api/v1/auth/logout`   | Public        |                           |
| Update Password   | PUT    | `/api/v1/users/:id`     | Owner         |                           |

### 📝 2. Posts

| Purpose             | Method | Endpoint                 | Access        | Notes                                      |
| ------------------- | ------ | ------------------------ | ------------- | ------------------------------------------ |
| Create new post     | POST   | `/api/v1/posts`          | Author        | Upload image, create slug                  |
| Get all posts       | GET    | `/api/v1/posts`          | Public        | Support page, limit, category, tag filters |
| Get post by ID/slug | GET    | `/api/v1/posts/:id`      | Public        | Include author, comments, likeCount        |
| Update post         | PUT    | `/api/v1/posts/:id`      | Author only   | Only if user = post.author                 |
| Delete post         | DELETE | `/api/v1/posts/:id`      | Author/Admin  | Cascade delete comments                    |
| Like/Unlike post    | POST   | `/api/v1/posts/:id/like` | Authenticated | Toggle like status                         |

### 💬 3. Comments

| Purpose           | Method | Endpoint                         | Access        | Notes                  |
| ----------------- | ------ | -------------------------------- | ------------- | ---------------------- |
| Add comment       | POST   | `/api/v1/posts/:postId/comments` | Authenticated | Add to post            |
| Get post comments | GET    | `/api/v1/posts/:postId/comments` | Public        | Paginated list         |
| Get all comment   | GET    | `/api/v1/comments/:postId`       | Owner/Admin   | Cascade child comments |
| Update comment    | PUT    | `/api/v1/comments/:id`           | Owner/Admin   | Cascade child comments |
| Delete comment    | DELETE | `/api/v1/comments/:id`           | Owner/Admin   | Cascade child comments |

### 👍 4. Likes

| Purpose            | Method | Endpoint                              | Access        | Notes                                                            |
| ------------------ | ------ | ------------------------------------- | ------------- | ---------------------------------------------------------------- |
| List likes on post | GET    | `/api/v1/posts/:postId/likes`         | Public        | List all likes on a post (e.g. user IDs who liked it)            |
| Like a post        | POST   | `/api/v1/posts/:postId/likes`         | Authenticated | Like the post (the requesting user’s like is recorded)           |
| Remove a like      | DELETE | `/api/v1/posts/:postId/likes/:userId` | Authenticated | Remove like by specific user. Can omit `userId` for current user |

### ⚙️ 5. Admin & Platform Controls

| Purpose         | Method | Endpoint                  | Access | Notes                             |
| --------------- | ------ | ------------------------- | ------ | --------------------------------- |
| Get all users   | GET    | `/api/v1/admin/users`     | Admin  | Paginated                         |
| Delete any post | DELETE | `/api/v1/admin/posts/:id` | Admin  | Force delete                      |
| System metrics  | GET    | `/api/v1/admin/metrics`   | Admin  | Monitor traffic, post count, etc. |
