const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/productModel");
const Donor = require("./models/donorModel");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes

app.get("/", (req, res) => {
  res.send("Hello Demo API");
});

app.get("/blog", (req, res) => {
  res.send("Hello Blog, My name is Sandeep");
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// update a product
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    // we cannot find any product in database
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete a product

app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET all donors
app.get("/donors", async (req, res) => {
  try {
    const { bloodType, city, state, country } = req.query;

    const query = {};
    if (bloodType) {
      query.bloodType = bloodType;
    }
    if (city) {
      query["location.city"] = city;
    }
    if (state) {
      query["location.state"] = state;
    }
    if (country) {
      query["location.country"] = country;
    }
    const donors = await Donor.find(query);
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one donor
app.get("/donors/:id", async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (donor) {
      res.json(donor);
    } else {
      res.status(404).json({ message: "Donor not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a donor
app.post("/donors", async (req, res) => {
  const donor = new Donor(req.body);

  try {
    const newDonor = await donor.save();
    res.status(201).json(newDonor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a donor
app.patch("/donors/:id", async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (donor) {
      if (req.body.name != null) {
        donor.name = req.body.name;
      }
      if (req.body.age != null) {
        donor.age = req.body.age;
      }
      if (req.body.gender != null) {
        donor.gender = req.body.gender;
      }
      if (req.body.height != null) {
        donor.height = req.body.height;
      }
      if (req.body.weight != null) {
        donor.weight = req.body.weight;
      }
      if (req.body.location != null) {
        if (req.body.location.city != null) {
          donor.location.city = req.body.location.city;
        }
        if (req.body.location.state != null) {
          donor.location.state = req.body.location.state;
        }
        if (req.body.location.country != null) {
          donor.location.country = req.body.location.country;
        }
      }
      if (req.body.contact != null) {
        if (req.body.contact.email != null) {
          donor.contact.email = req.body.contact.email;
        }
        if (req.body.contact.phone != null) {
          donor.contact.phone = req.body.contact.phone;
        }
      }
      if (req.body.bloodType != null) {
        donor.bloodType = req.body.bloodType;
      }
      if (req.body.lastDonationDate != null) {
        donor.lastDonationDate = req.body.lastDonationDate;
      }
      const updatedDonor = await donor.save();
      res.json(updatedDonor);
    } else {
      res.status(404).json({ message: "Donor not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a donor
app.delete("/donors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const donor = await Donor.findByIdAndDelete(id);
    if (!donor) {
      return res
        .status(404)
        .json({ message: `cannot find any donor with ID ${id}` });
    }
    res.status(200).json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://admin:admin@demoapi.es5luo0.mongodb.net/Demoapi?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(3000, () => {
      console.log(`Node API app is running on port 3000`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
