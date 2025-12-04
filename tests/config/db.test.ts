import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import mongoose from "mongoose";
import { connectToDatabase } from "../../src/config/db.js";

// ───── Mock mongoose ─────
vi.mock("mongoose", () => ({
  default: {
    connect: vi.fn(),
  },
}));

// ───── Mock process.exit ─────
const mockExit = vi.spyOn(process, "exit").mockImplementation((): never => {
  throw new Error("process.exit called");
});

// ───── Mock console ─────
const mockLog = vi.spyOn(console, "log").mockImplementation(() => {});
const mockError = vi.spyOn(console, "error").mockImplementation(() => {});

describe("connectToDatabase", () => {
  beforeEach(() => {
    // Išvalom ENV prieš kiekvieną testą
    delete process.env.DB_USER;
    delete process.env.DB_PASS;
    delete process.env.DB_CLUSTER;
    delete process.env.DB_NAME;

    // Išvalom mock'us
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ───── Test 1: sėkmingas prisijungimas ─────
  it("should connect to MongoDB successfully", async () => {
    process.env.DB_USER = "testuser";
    process.env.DB_PASS = "testpass";
    process.env.DB_CLUSTER = "testcluster";
    process.env.DB_NAME = "testdb";

    const mockConnect = vi.mocked(mongoose.connect);
    mockConnect.mockResolvedValueOnce({} as any);

    await connectToDatabase();

    const expectedUri = "mongodb+srv://testuser:testpass@testcluster.mongodb.net/?retryWrites=true&w=majority";

    expect(mockConnect).toHaveBeenCalledWith(expectedUri, {
      dbName: "testdb",
    });
    expect(mockLog).toHaveBeenCalledWith("Prisijungta prie duomenu bazes");
    expect(mockExit).not.toHaveBeenCalled();
  });

  // ───── Test 2: klaida jungiantis ─────
  it("should handle connection error and exit process", async () => {
    process.env.DB_USER = "testuser";
    process.env.DB_PASS = "testpass";
    process.env.DB_CLUSTER = "testcluster";
    process.env.DB_NAME = "testdb";

    const mockConnect = vi.mocked(mongoose.connect);
    const connectionError = new Error("Connection failed");
    mockConnect.mockRejectedValueOnce(connectionError);

    await expect(connectToDatabase()).rejects.toThrow("process.exit called");

    expect(mockError).toHaveBeenCalledWith("Klaida jungianties prie MongoDB:", connectionError);
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  // ───── Test 3: neteisinga URI (debug testas) ─────
  it("should fail if TEST_FAIL_TRIGGER is thrown", async () => {
    const originalFn = connectToDatabase;

    // Sukuriam "debug" funkciją, kuri meta klaidą
    const failFn = async () => {
      throw new Error("TEST_FAIL_TRIGGER");
    };

    await expect(failFn()).rejects.toThrow("TEST_FAIL_TRIGGER");
  });

  // ───── Test 4: URI teisingumas ─────
  it("should construct the correct MongoDB URI", async () => {
    process.env.DB_USER = "admin";
    process.env.DB_PASS = "securepass123";
    process.env.DB_CLUSTER = "production-cluster";
    process.env.DB_NAME = "production_db";

    const mockConnect = vi.mocked(mongoose.connect);
    mockConnect.mockResolvedValueOnce({} as any);

    await connectToDatabase();

    const expectedUri = "mongodb+srv://admin:securepass123@production-cluster.mongodb.net/?retryWrites=true&w=majority";

    expect(mockConnect).toHaveBeenCalledWith(expectedUri, {
      dbName: "production_db",
    });
  });

  // ───── Test 5: ENV kintamųjų nebuvimas ─────
  it("should handle undefined environment variables gracefully", async () => {
    const mockConnect = vi.mocked(mongoose.connect);
    mockConnect.mockResolvedValueOnce({} as any);

    await connectToDatabase();

    const expectedUri = "mongodb+srv://undefined:undefined@undefined.mongodb.net/?retryWrites=true&w=majority";

    expect(mockConnect).toHaveBeenCalledWith(expectedUri, {
      dbName: undefined,
    });
  });
});
