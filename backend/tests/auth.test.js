const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../src/models/userModel");
const Comment = require("../src/models/commentModel");

// Clean DB before each test
beforeEach(async () => {
  await User.deleteMany({});
  await Comment.deleteMany({});
});

describe("User Authentication", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user with valid data and return token", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        email: "testuser@example.com",
        password: "StrongP4ss!",
        dateOfBirth: "1995-01-01",
        address: {
          street: "123 Main St",
          city: "Helsinki",
          postalCode: "00100",
        },
      };

      const res = await api
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(res.body.message).toBe("User registered successfully!");
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.email).toBe(userData.email);
      expect(res.body.user.firstName).toBe(userData.firstName);
      expect(res.body.user).toHaveProperty("role");
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should assign 'admin' role to the first user", async () => {
      const userData = {
        firstName: "First",
        lastName: "Admin",
        email: "firstuser@example.com",
        password: "AdminPass123!",
        dateOfBirth: "1990-01-01",
        address: {
          street: "1 Admin Street",
          city: "Helsinki",
          postalCode: "00100",
        },
      };

      const res = await api
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(res.body.user.role).toBe("admin");
    });

    it("should assign 'user' role to subsequent users", async () => {
      // Create first user (will be admin)
      await api.post("/api/auth/register").send({
        firstName: "First",
        lastName: "User",
        email: "first@example.com",
        password: "Pass123!",
        dateOfBirth: "1990-01-01",
        address: {
          street: "1 Street",
          city: "Helsinki",
          postalCode: "00100",
        },
      });

      // Create second user (should be regular user)
      const res = await api
        .post("/api/auth/register")
        .send({
          firstName: "Second",
          lastName: "User",
          email: "second@example.com",
          password: "Pass123!",
          dateOfBirth: "1992-01-01",
          address: {
            street: "2 Street",
            city: "Espoo",
            postalCode: "02100",
          },
        })
        .expect(201);

      expect(res.body.user.role).toBe("user");
    });

    it("should return 400 when email is missing", async () => {
      const userData = {
        firstName: "No",
        lastName: "Email",
        password: "StrongP4ss!",
        dateOfBirth: "2000-01-01",
        address: {
          street: "456 Oak Ave",
          city: "Espoo",
          postalCode: "02100",
        },
      };

      const res = await api
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 when password is missing", async () => {
      const userData = {
        firstName: "No",
        lastName: "Password",
        email: "nopass@example.com",
        dateOfBirth: "2000-01-01",
        address: {
          street: "789 Pine St",
          city: "Tampere",
          postalCode: "33100",
        },
      };

      const res = await api
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 when email is duplicated", async () => {
      const userData = {
        firstName: "Duplicate",
        lastName: "User",
        email: "duplicate@example.com",
        password: "StrongP4ss!",
        dateOfBirth: "1995-01-01",
        address: {
          street: "100 Duplicate St",
          city: "Helsinki",
          postalCode: "00200",
        },
      };

      await api.post("/api/auth/register").send(userData).expect(201);

      const res = await api
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(res.body.message).toBe("Email already in use.");
    });

    it("should return 400 when address is incomplete", async () => {
      const userData = {
        firstName: "No",
        lastName: "Address",
        email: "noaddress@example.com",
        password: "StrongP4ss!",
        dateOfBirth: "1995-01-01",
        address: {
          street: "100 Street",
          city: "Helsinki",
          // Missing postalCode
        },
      };

      const res = await api
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(res.body).toHaveProperty("message");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login a user with valid credentials and return JWT token", async () => {
      const userData = {
        firstName: "Login",
        lastName: "User",
        email: "login@example.com",
        password: "StrongP4ss!",
        dateOfBirth: "2000-01-01",
        address: {
          street: "200 Login Ave",
          city: "Tampere",
          postalCode: "33100",
        },
      };

      await api.post("/api/auth/register").send(userData).expect(201);

      const res = await api
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(res.body.message).toBe("Login successful");
      expect(res.body.user.email).toBe(userData.email);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should return 400 when email is missing", async () => {
      const res = await api
        .post("/api/auth/login")
        .send({
          password: "SomePassword!",
        })
        .expect(400);

      expect(res.body.message).toBe("Both fields must be filled");
    });

    it("should return 400 when password is missing", async () => {
      const res = await api
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
        })
        .expect(400);

      expect(res.body.message).toBe("Both fields must be filled");
    });

    it("should return 401 when email does not exist", async () => {
      const res = await api
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "SomePassword!",
        })
        .expect(401);

      expect(res.body.message).toBe("Invalid email or password.");
    });

    it("should return 401 when password is incorrect", async () => {
      const userData = {
        firstName: "Wrong",
        lastName: "Password",
        email: "wrongpass@example.com",
        password: "CorrectP4ss!",
        dateOfBirth: "1995-01-01",
        address: {
          street: "300 Wrong St",
          city: "Oulu",
          postalCode: "90100",
        },
      };

      await api.post("/api/auth/register").send(userData).expect(201);

      const res = await api
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: "WrongP4ss!",
        })
        .expect(401);

      expect(res.body.message).toBe("Invalid email or password.");
    });
  });
});

describe("Protected Routes - User Operations", () => {
  let userToken;
  let userId;

  beforeEach(async () => {
    const userData = {
      firstName: "Protected",
      lastName: "User",
      email: "protected@example.com",
      password: "SecureP4ss!",
      dateOfBirth: "1990-05-15",
      address: {
        street: "500 Protected Blvd",
        city: "Helsinki",
        postalCode: "00500",
      },
    };

    const signupRes = await api.post("/api/auth/register").send(userData);
    userToken = signupRes.body.token;
    userId = signupRes.body.user.userId;
  });

  describe("GET /api/users/me (Get User Profile)", () => {
    it("should get user profile when authenticated", async () => {
      const res = await api
        .get("/api/users/me")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.user.email).toBe("protected@example.com");
      expect(res.body.user.firstName).toBe("Protected");
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should return 401 when token is missing", async () => {
      const res = await api.get("/api/users/me").expect(401);

      expect(res.body.message).toBe("Unauthorized: Missing token");
    });

    it("should return 401 when token is invalid", async () => {
      const res = await api
        .get("/api/users/me")
        .set("Authorization", "Bearer invalid_token_here")
        .expect(401);

      expect(res.body.message).toBe("Invalid or expired token");
    });
  });

  describe("PUT /api/users/me (Update User Profile)", () => {
    it("should update user profile when authenticated", async () => {
      const updateData = {
        firstName: "UpdatedName",
        address: {
          street: "600 Updated St",
          city: "Espoo",
          postalCode: "02200",
        },
      };

      const res = await api
        .put("/api/users/me")
        .set("Authorization", `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(res.body.user.firstName).toBe("UpdatedName");
      expect(res.body.user.address.street).toBe("600 Updated St");
    });

    it("should return 401 when updating without token", async () => {
      const res = await api
        .put("/api/users/me")
        .send({ firstName: "NewName" })
        .expect(401);

      expect(res.body.message).toBe("Unauthorized: Missing token");
    });
  });

  describe("POST /api/favorites/:eventId (Add to Favorites)", () => {
    // TODO: Mock eventsService.fetchEventById to avoid external API dependency
    it.skip("should add event to favorites when authenticated", async () => {
      // SKIPPED: Requires mocking external Helsinki Events API
      // To enable: Mock EventsService.fetchEventById() in test setup
      const eventId = "hel:test123";

      const res = await api
        .post(`/api/favorites/${eventId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.message).toBe("Added to favorites");
      expect(res.body.favorites).toContainEqual(
        expect.objectContaining({ eventId })
      );
    });

    it("should return 401 when adding favorite without token", async () => {
      const eventId = "hel:12345";

      const res = await api.post(`/api/favorites/${eventId}`).expect(401);

      expect(res.body.message).toBe("Unauthorized: Missing token");
    });
  });

  describe("DELETE /api/favorites/:eventId (Remove from Favorites)", () => {
    // TODO: Mock eventsService.fetchEventById to avoid external API dependency
    it.skip("should remove event from favorites when authenticated", async () => {
      // SKIPPED: Requires mocking external Helsinki Events API
      // To enable: Mock EventsService.fetchEventById() in test setup
      const eventId = "hel:test123";

      // First add to favorites
      await api
        .post(`/api/favorites/${eventId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      // Then remove
      const res = await api
        .delete(`/api/favorites/${eventId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.message).toBe("Removed from favorites");
      expect(res.body.favorites).not.toContainEqual(
        expect.objectContaining({ eventId })
      );
    });

    it("should return 401 when removing favorite without token", async () => {
      const eventId = "hel:12345";

      const res = await api.delete(`/api/favorites/${eventId}`).expect(401);

      expect(res.body.message).toBe("Unauthorized: Missing token");
    });
  });

  describe("POST /api/comments (Create Comment)", () => {
    it("should create a comment when authenticated", async () => {
      const commentData = {
        apiId: "hel:12345",
        comment: "This is a test comment",
      };

      const res = await api
        .post("/api/comments")
        .set("Authorization", `Bearer ${userToken}`)
        .send(commentData)
        .expect(201);

      expect(res.body.comment).toBe(commentData.comment);
      expect(res.body.apiId).toBe(commentData.apiId);
      expect(res.body.user._id).toBe(userId);
      expect(res.body.user).toHaveProperty("firstName");
      expect(res.body.user).toHaveProperty("lastName");
    });

    it("should return 401 when creating comment without token", async () => {
      const commentData = {
        apiId: "hel:12345",
        comment: "Unauthorized comment",
      };

      const res = await api.post("/api/comments").send(commentData).expect(401);

      expect(res.body.message).toBe("Unauthorized: Missing token");
    });
  });

  describe("DELETE /api/comments/:commentId (Delete Own Comment)", () => {
    it("should delete own comment when authenticated", async () => {
      // Create a comment first
      const commentData = {
        apiId: "hel:12345",
        comment: "Comment to delete",
      };

      const createRes = await api
        .post("/api/comments")
        .set("Authorization", `Bearer ${userToken}`)
        .send(commentData)
        .expect(201);

      const commentId = createRes.body._id;

      // Delete the comment
      const res = await api
        .delete(`/api/comments/${commentId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.message).toBe("Comment deleted");
    });

    it("should return 401 when deleting comment without token", async () => {
      const res = await api
        .delete("/api/comments/507f1f77bcf86cd799439011")
        .expect(401);

      expect(res.body.message).toBe("Unauthorized: Missing token");
    });
  });

  describe("POST /api/ratings/events/:apiId/rate (Rate Event)", () => {
    it("should rate an event when authenticated", async () => {
      const eventId = "hel:12345";
      const ratingData = { rating: 4 };

      const res = await api
        .post(`/api/ratings/events/${eventId}/rate`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(ratingData)
        .expect(200);

      expect(res.body).toHaveProperty("averageRating");
      expect(typeof res.body.averageRating).toBe("number");
    });

    it("should return 401 when rating without token", async () => {
      const eventId = "hel:12345";
      const ratingData = { rating: 5 };

      const res = await api
        .post(`/api/ratings/events/${eventId}/rate`)
        .send(ratingData)
        .expect(401);

      expect(res.body.message).toBe("Unauthorized: Missing token");
    });
  });
});

// Close DB connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
