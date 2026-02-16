| Use case / Resource      | HTTP   | URL                       | Who              | Purpose                            |
| ------------------------ | ------ | ------------------------- | ---------------- | ---------------------------------- |
| Get logged-in user       | GET    | `/api/users/me/`          | Authenticated    | Get current user’s private profile |
| Update logged-in profile | PATCH  | `/api/users/me/`          | Authenticated    | Update current user’s profile      |
| Get public user profile  | GET    | `/api/users/<username>/`  | Public           | View public profile by username    |
| Find user by email       | GET    | `/api/users/?email=`      | Admin / Internal | Lookup user by email               |
| Register user            | POST   | `/api/auth/register/`     | Public           | Create a new user account          |
|                          |        |                           |                  |                                    |
| List published blogs     | GET    | `/api/blogs/`             | Public           | List all published blogs           |
| Create blog              | POST   | `/api/blogs/`             | Authenticated    | Create a new blog post             |
| Read blog                | GET    | `/api/blogs/<slug>/`      | Public           | Read a single blog                 |
| Update blog              | PATCH  | `/api/blogs/<pk>/manage/` | Author           | Update own blog post               |
| Delete blog              | DELETE | `/api/blogs/<pk>/manage/` | Author           | Delete own blog post               |

media folder (contains images send by user) is created but it is local and not pushed to remote
