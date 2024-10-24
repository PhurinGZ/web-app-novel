const express = require("express");
const ListNovel = require("../model/listNovel");
const router = express.Router();

// Get all list novels
router.get("/", async (req, res) => {
  try {
    const listNovels = await ListNovel.find()
      .populate("novels")
    //   .populate("createdBy")
    //   .populate("updatedBy");
    res.json(listNovels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single list novel by ID
router.get("/:id", async (req, res) => {
  try {
    const listNovel = await ListNovel.findById(req.params.id)
      .populate("novels")
      .populate("createdBy")
      .populate("updatedBy");
    if (!listNovel) return res.status(404).json({ message: "List not found" });
    res.json(listNovel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new list novel
router.post("/", async (req, res) => {
  const { nameListEN, nameListTH, novels, createdBy, publishedAt } = req.body;

  try {
    const listNovel = new ListNovel({
      nameListEN,
      nameListTH,
      novels,
      createdBy,
      publishedAt,
    });

    await listNovel.save();
    res.status(201).json(listNovel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a list novel by ID
router.put("/:id", async (req, res) => {
  const { nameListEN, nameListTH, novels, updatedBy, publishedAt } = req.body;

  try {
    const listNovel = await ListNovel.findById(req.params.id);
    if (!listNovel) return res.status(404).json({ message: "List not found" });

    listNovel.nameListEN = nameListEN || listNovel.nameListEN;
    listNovel.nameListTH = nameListTH || listNovel.nameListTH;
    listNovel.novels = novels || listNovel.novels;
    listNovel.updatedBy = updatedBy;
    listNovel.publishedAt = publishedAt || listNovel.publishedAt;
    listNovel.updatedAt = Date.now();

    await listNovel.save();
    res.json(listNovel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a list novel by ID
router.delete("/:id", async (req, res) => {
  try {
    const listNovel = await ListNovel.findById(req.params.id);
    if (!listNovel) return res.status(404).json({ message: "List not found" });

    await listNovel.remove();
    res.json({ message: "List deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
