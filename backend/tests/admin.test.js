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

describe("Admin Panel - Role-Based Access Control", () => {
  let superAdminToken;
  let adminToken;
  let userToken;
  let superAdminId;
  let adminId;
  let regularUserId;

  beforeEach(async () => {
    jest.setTimeout(10000); // Increase timeout to 10 seconds
    // Create Super Admin (first user or via ADMIN_EMAIL)
    const superAdminData = {
      firstName: "Super",
      lastName: "Admin",
      email: process.env.ADMIN_EMAIL || "superadmin@example.com",
      password: "SuperAdmin123!",
      dateOfBirth: "1980-01-01",
      address: {
        street: "1 Admin Plaza",
        city: "Helsinki",
        postalCode: "00100",
      },
    };

    const superAdminRes = await api
      .post("/api/auth/register")
      .send(superAdminData);
    superAdminToken = superAdminRes.body.token;
    superAdminId = superAdminRes.body.user.userId;

    // Create Regular Admin
    const adminData = {
      firstName: "Regular",
      lastName: "Admin",
      email: "admin@example.com",
      password: "Admin123!",
      dateOfBirth: "1985-01-01",
      address: {
        street: "2 Admin Street",
        city: "Espoo",
        postalCode: "02100",
      },
    };

    const adminRes = await api.post("/api/auth/register").send(adminData);
    adminId = adminRes.body.user.userId;

    // Manually set admin role
    await User.findByIdAndUpdate(adminId, { role: "admin" });
    
    // Login again to get token with correct role
    const adminLoginRes = await api.post("/api/auth/login").send({
      email: adminData.email,
      password: adminData.password,
    });
    adminToken = adminLoginRes.body.token;

    // Create Regular User
    const userData = {
      firstName: "Regular",
      lastName: "User",
      email: "user@example.com",
      password: "User123!",
      dateOfBirth: "1990-01-01",
      address: {
        street: "3 User Lane",
        city: "Tampere",
        postalCode: "33100",
      },
    };

    const userRes = await api.post("/api/auth/register").send(userData);
    userToken = userRes.body.token;
    regularUserId = userRes.body.user.userId;
  });

  describe("GET /api/admin/stats (Admin Dashboard Statistics)", () => {
    it("should return stats when accessed by super admin", async () => {
      const res = await api
        .get("/api/admin/stats")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty("totalUsers");
      expect(res.body).toHaveProperty("totalReviews");
      expect(res.body).toHaveProperty("totalEvents");
      expect(res.body).toHaveProperty("recentUsers");
      expect(Array.isArray(res.body.recentUsers)).toBe(true);
    });

    it("should return stats when accessed by regular admin", async () => {
      const res = await api
        .get("/api/admin/stats")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty("totalUsers");
      expect(res.body).toHaveProperty("totalReviews");
    });

    it("should return 403 when accessed by regular user", async () => {
      const res = await api
        .get("/api/admin/stats")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.error).toBe("Admin access required");
    });

    it("should return 401 when accessed without token", async () => {
      const res = await api.get("/api/admin/stats").expect(401);

      expect(res.body.message).toBe("Unauthorized: Missing token");
    });
  });

  describe("GET /api/admin/users (Get All Users)", () => {
    it("should return all users when accessed by admin", async () => {
      const res = await api
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty("users");
      expect(Array.isArray(res.body.users)).toBe(true);
      expect(res.body.users.length).toBeGreaterThan(0);
      expect(res.body.users[0]).not.toHaveProperty("password");
    });

    it("should return 403 when accessed by regular user", async () => {
      const res = await api
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.error).toBe("Admin access required");
    });

    it("should return 401 when accessed without token", async () => {
      const res = await api.get("/api/admin/users").expect(401);

      expect(res.body.message).toBe("Unauthorized: Missing token");
    });
  });

  describe("GET /api/admin/users/:userId (Get User Details)", () => {
    it("should return user details when accessed by admin", async () => {
      const res = await api
        .get(`/api/admin/users/${regularUserId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.user.email).toBe("user@example.com");
      expect(res.body.user.firstName).toBe("Regular");
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should return 403 when accessed by regular user", async () => {
      const res = await api
        .get(`/api/admin/users/${regularUserId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.error).toBe("Admin access required");
    });

    it("should return 404 when user does not exist", async () => {
      const fakeUserId = "507f1f77bcf86cd799439011";

      const res = await api
        .get(`/api/admin/users/${fakeUserId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);

      expect(res.body.error).toContain("User not found");
    });
  });

  describe("PATCH /api/admin/users/:userId/role (Update User Role)", () => {
    it("should allow super admin to promote user to admin", async () => {
      const res = await api
        .patch(`/api/admin/users/${regularUserId}/role`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ role: "admin" })
        .expect(200);

      expect(res.body.user.role).toBe("admin");
      expect(res.body.message).toBe("Role updated successfully");
    });

    it("should allow super admin to promote admin to superadmin", async () => {
      const res = await api
        .patch(`/api/admin/users/${adminId}/role`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ role: "superadmin" })
        .expect(200);

      expect(res.body.user.role).toBe("superadmin");
    });

    it("should allow regular admin to promote user to admin", async () => {
      const res = await api
        .patch(`/api/admin/users/${regularUserId}/role`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "admin" })
        .expect(200);

      expect(res.body.user.role).toBe("admin");
    });

    it("should NOT allow regular admin to promote to superadmin", async () => {
      const res = await api
        .patch(`/api/admin/users/${regularUserId}/role`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "superadmin" })
        .expect(400);

      expect(res.body.error).toContain("Only super admin can modify superadmin roles");
    });

    it("should NOT allow regular admin to modify another admin", async () => {
      // Create another admin
      const anotherAdmin = await User.create({
        firstName: "Another",
        lastName: "Admin",
        email: "anotheradmin@example.com",
        password: "Admin123!",
        dateOfBirth: "1988-01-01",
        address: {
          street: "4 Admin Ave",
          city: "Oulu",
          postalCode: "90100",
        },
        role: "admin",
      });

      const res = await api
        .patch(`/api/admin/users/${anotherAdmin._id}/role`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "user" })
        .expect(400);

      expect(res.body.error).toContain("Only super admin can modify admin users");
    });

    it("should return 403 when regular user tries to change role", async () => {
      const res = await api
        .patch(`/api/admin/users/${regularUserId}/role`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ role: "admin" })
        .expect(403);

      expect(res.body.error).toBe("Admin access required");
    });

    it("should return 400 with invalid role", async () => {
      const res = await api
        .patch(`/api/admin/users/${regularUserId}/role`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ role: "invalidrole" })
        .expect(400);

      expect(res.body.error).toContain("Invalid role");
    });
  });

  describe("DELETE /api/admin/users/:userId (Delete User)", () => {
    it("should allow super admin to delete regular user", async () => {
      const res = await api
        .delete(`/api/admin/users/${regularUserId}`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .expect(200);

      expect(res.body.message).toBe("User deleted successfully");

      // Verify user is deleted
      const deletedUser = await User.findById(regularUserId);
      expect(deletedUser).toBeNull();
    });

    it("should allow super admin to delete admin", async () => {
      const res = await api
        .delete(`/api/admin/users/${adminId}`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .expect(200);

      expect(res.body.message).toBe("User deleted successfully");
    });

    it("should allow regular admin to delete regular user", async () => {
      const res = await api
        .delete(`/api/admin/users/${regularUserId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.message).toBe("User deleted successfully");
    });

    it("should NOT allow regular admin to delete another admin", async () => {
      // Create another admin
      const anotherAdmin = await User.create({
        firstName: "Another",
        lastName: "Admin",
        email: "deleteadmin@example.com",
        password: "Admin123!",
        dateOfBirth: "1988-01-01",
        address: {
          street: "5 Delete St",
          city: "Turku",
          postalCode: "20100",
        },
        role: "admin",
      });

      const res = await api
        .delete(`/api/admin/users/${anotherAdmin._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);

      expect(res.body.error).toContain("Only super admin can delete admin users");
    });

    it("should NOT allow admin to delete themselves", async () => {
      const res = await api
        .delete(`/api/admin/users/${adminId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);

      expect(res.body.error).toContain("Cannot delete your own account");
    });

    it("should return 403 when regular user tries to delete", async () => {
      const res = await api
        .delete(`/api/admin/users/${regularUserId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.error).toBe("Admin access required");
    });

    it("should return 404 when user does not exist", async () => {
      const fakeUserId = "507f1f77bcf86cd799439011";

      const res = await api
        .delete(`/api/admin/users/${fakeUserId}`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .expect(400);

      expect(res.body.error).toContain("User not found");
    });
  });

  describe("GET /api/admin/reviews (Get All Reviews)", () => {
    it("should return all reviews when accessed by admin", async () => {
      // Create some comments first
      await Comment.create({
        user: regularUserId,
        apiId: "hel:12345",
        comment: "Test comment 1",
      });

      await Comment.create({
        user: adminId,
        apiId: "hel:67890",
        comment: "Test comment 2",
      });

      const res = await api
        .get("/api/admin/reviews")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty("reviews");
      expect(Array.isArray(res.body.reviews)).toBe(true);
      expect(res.body.reviews.length).toBe(2);
    });

    it("should return 403 when accessed by regular user", async () => {
      const res = await api
        .get("/api/admin/reviews")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.error).toBe("Admin access required");
    });
  });

  describe("DELETE /api/admin/reviews/:commentId (Delete Review)", () => {
    it("should allow admin to delete any comment", async () => {
      const comment = await Comment.create({
        user: regularUserId,
        apiId: "hel:12345",
        comment: "Comment to delete",
      });

      const res = await api
        .delete(`/api/admin/reviews/${comment._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.message).toBe("Comment deleted");

      // Verify comment is deleted
      const deletedComment = await Comment.findById(comment._id);
      expect(deletedComment).toBeNull();
    });

    it("should return 403 when regular user tries to delete", async () => {
      const comment = await Comment.create({
        user: adminId,
        apiId: "hel:12345",
        comment: "Admin comment",
      });

      const res = await api
        .delete(`/api/admin/reviews/${comment._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.error).toBe("Admin access required");
    });

    it("should return 404 when comment does not exist", async () => {
      const fakeCommentId = "507f1f77bcf86cd799439011";

      const res = await api
        .delete(`/api/admin/reviews/${fakeCommentId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);

      expect(res.body.error).toContain("Comment not found");
    });
  });
});

// Close DB connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
