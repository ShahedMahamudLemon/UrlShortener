const request = require("supertest");
const app = require("../server.js");

describe("URL Shortener Service", () => {
  // Test valid URL shortening
  it("should create a short URL for a valid long URL", async () => {
    const response = await request(app).post("/shorten").send({
      longUrl: "https://en.wikipedia.org/wiki/The_medium_is_the_message",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("shortUrl");
    expect(response.body).toHaveProperty(
      "longUrl",
      "https://en.wikipedia.org/wiki/The_medium_is_the_message"
    );
  });

  // Test invalid URL submission
  it("should return an error for an invalid URL", async () => {
    const response = await request(app)
      .post("/shorten")
      .send({ longUrl: "invalid-url" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid long URL");
  });

  // Test short URL uniqueness
  it("should return the same short URL for an already shortened URL", async () => {
    const longUrl = "https://www.duplicate.com";

    const res1 = await request(app).post("/shorten").send({ longUrl });

    expect(res1.status).toBe(200);
    const firstShortUrl = res1.body.shortUrl;

    const res2 = await request(app).post("/shorten").send({ longUrl });

    expect(res2.status).toBe(200);
    expect(res2.body.shortUrl).toEqual(firstShortUrl);
  });

  // Test redirection
  it("should redirect to the original long URL when accessing the short URL", async () => {
    const longUrl = "https://www.redirect.com";

    const res = await request(app).post("/shorten").send({ longUrl });

    expect(res.status).toBe(200);
    const shortUrlCode = res.body.shortUrl.split("/").pop();

    const redirectResponse = await request(app)
      .get(`/${shortUrlCode}`)
      .set("Accept", "application/json");

    expect(redirectResponse.status).toBe(302);
    expect(redirectResponse.headers.location).toBe(longUrl);
  });

  // Test if generated short URLs have exactly 6 characters
  it("should generate a short URL code of exactly 6 characters", async () => {
    const longUrl = "https://www.sixchar.com";

    const response = await request(app).post("/shorten").send({ longUrl });

    expect(response.status).toBe(200);
    const shortUrlCode = response.body.shortUrl.split("/").pop();
    expect(shortUrlCode.length).toBe(6);
  });
});
