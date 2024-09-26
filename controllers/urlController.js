const Url = require("../models/urlModel");
const dotenv = require("dotenv");

dotenv.config();

// Function to validating URLs
const isValidUrl = (url) => {
  const regex = /^(https?:\/\/)([\w-]+(\.[\w-]+)+)([\/\w- .?&%=]*)*$/;
  return regex.test(url);
};

// Function to convert a number (timestamp) to a base62 string
function toBase62(num) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const base = characters.length;

  while (num > 0) {
    result = characters[num % base] + result;
    num = Math.floor(num / base);
  }

  return result;
}
// Function to generate random string
function generateRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

// Function to generate unique code
function generateUniqueCode() {
  const timestamp = Date.now();
  let urlCode = toBase62(timestamp);

  // Ensure the code is exactly 6 characters long
  if (urlCode.length > 6) {
    urlCode = urlCode.substring(0, 6);
  } else if (urlCode.length < 6) {
    const randomString = generateRandomString(6 - urlCode.length);
    urlCode = urlCode + randomString;
  }

  return urlCode;
}

// Function to create short url
const createShortUrl = async (req, res) => {
  const { longUrl } = req.body;

  if (!isValidUrl(longUrl)) {
    return res.status(400).json({ error: "Invalid long URL" });
  }

  try {
    let url = await Url.findOne({ longUrl });

    if (url) {
      return res
        .status(200)
        .json({ message: "URL already shortened", shortUrl: url.shortUrl });
    } else {
      let urlCode;
      let urlExists;

      do {
        urlCode = generateUniqueCode();
        urlExists = await Url.findOne({ urlCode });
      } while (urlExists);

      const shortUrl = `${process.env.BASE_URL}/${urlCode}`;

      url = new Url({
        longUrl,
        shortUrl,
        urlCode,
        date: new Date(),
      });

      await url.save();

      return res.status(201).json(url);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Function to redirect to the original long URL
const redirectToLongUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });

    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json("No URL found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};

module.exports = { createShortUrl, redirectToLongUrl };
