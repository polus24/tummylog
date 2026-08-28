// TummyLog shared API worker
// Deploy via the Cloudflare dashboard (Workers & Pages -> Create Worker),
// then bind a KV namespace to this worker as FOODS_KV
// (Settings -> Variables -> KV Namespace Bindings).
//
// Routes:
//   GET    /api/foods      returns the full shared food list
//   POST   /api/foods      create or update one food
//   DELETE /api/foods/:id  remove one food by id

const SEED_FOODS = [
  {
    "id": "apple",
    "name": "Apple",
    "category": "Fruits",
    "status": "avoid",
    "notes": "High fructose and sorbitol."
  },
  {
    "id": "pear",
    "name": "Pear",
    "category": "Fruits",
    "status": "avoid",
    "notes": "High fructose and sorbitol."
  },
  {
    "id": "mango",
    "name": "Mango",
    "category": "Fruits",
    "status": "avoid",
    "notes": "High fructose."
  },
  {
    "id": "watermelon",
    "name": "Watermelon",
    "category": "Fruits",
    "status": "avoid",
    "notes": "High in fructans."
  },
  {
    "id": "cherries",
    "name": "Cherries",
    "category": "Fruits",
    "status": "avoid",
    "notes": "High sorbitol."
  },
  {
    "id": "peach",
    "name": "Peach",
    "category": "Fruits",
    "status": "avoid",
    "notes": "Stone fruit, high sorbitol."
  },
  {
    "id": "plum",
    "name": "Plum",
    "category": "Fruits",
    "status": "avoid",
    "notes": "Stone fruit, high sorbitol."
  },
  {
    "id": "apricot",
    "name": "Apricot",
    "category": "Fruits",
    "status": "avoid",
    "notes": "Stone fruit, high sorbitol."
  },
  {
    "id": "dried-fruit",
    "name": "Dried fruit",
    "category": "Fruits",
    "status": "avoid",
    "notes": "Concentrated FODMAPs."
  },
  {
    "id": "fruit-juice",
    "name": "Fruit juice",
    "category": "Fruits",
    "status": "avoid",
    "notes": "Large amounts concentrate fructose."
  },
  {
    "id": "avocado",
    "name": "Avocado",
    "category": "Fruits",
    "status": "avoid",
    "notes": "OK in small amounts (~1/8), high FODMAP in large portions."
  },
  {
    "id": "banana",
    "name": "Banana",
    "category": "Fruits",
    "status": "moderate",
    "notes": "Best when firm/underripe; ripe bananas are higher FODMAP."
  },
  {
    "id": "blueberries",
    "name": "Blueberries",
    "category": "Fruits",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "strawberries",
    "name": "Strawberries",
    "category": "Fruits",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "grapes",
    "name": "Grapes",
    "category": "Fruits",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "orange",
    "name": "Orange",
    "category": "Fruits",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "mandarin",
    "name": "Mandarin",
    "category": "Fruits",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "kiwi",
    "name": "Kiwi",
    "category": "Fruits",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "pineapple",
    "name": "Pineapple",
    "category": "Fruits",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "cantaloupe",
    "name": "Cantaloupe",
    "category": "Fruits",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "honeydew",
    "name": "Honeydew melon",
    "category": "Fruits",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "onion",
    "name": "Onion",
    "category": "Vegetables",
    "status": "avoid",
    "notes": "All forms, including powder."
  },
  {
    "id": "garlic",
    "name": "Garlic",
    "category": "Vegetables",
    "status": "avoid",
    "notes": "All forms, including powder."
  },
  {
    "id": "cauliflower",
    "name": "Cauliflower",
    "category": "Vegetables",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "mushrooms",
    "name": "Mushrooms",
    "category": "Vegetables",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "asparagus",
    "name": "Asparagus",
    "category": "Vegetables",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "artichoke",
    "name": "Artichoke",
    "category": "Vegetables",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "leek",
    "name": "Leek",
    "category": "Vegetables",
    "status": "avoid",
    "notes": "Green tops OK in small amounts."
  },
  {
    "id": "spring-onion-white",
    "name": "Spring onion (white part)",
    "category": "Vegetables",
    "status": "avoid",
    "notes": "Green part is lower FODMAP."
  },
  {
    "id": "savoy-cabbage",
    "name": "Savoy cabbage",
    "category": "Vegetables",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "carrot",
    "name": "Carrot",
    "category": "Vegetables",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "potato",
    "name": "Potato",
    "category": "Vegetables",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "zucchini",
    "name": "Zucchini",
    "category": "Vegetables",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "cucumber",
    "name": "Cucumber",
    "category": "Vegetables",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "bell-pepper",
    "name": "Bell pepper",
    "category": "Vegetables",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "tomato",
    "name": "Tomato",
    "category": "Vegetables",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "spinach",
    "name": "Spinach",
    "category": "Vegetables",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "kale",
    "name": "Kale",
    "category": "Vegetables",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "green-beans",
    "name": "Green beans",
    "category": "Vegetables",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "bok-choy",
    "name": "Bok choy",
    "category": "Vegetables",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "eggplant",
    "name": "Eggplant",
    "category": "Vegetables",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "bean-sprouts",
    "name": "Bean sprouts",
    "category": "Vegetables",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "wheat-bread",
    "name": "Wheat bread",
    "category": "Grains & starches",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "pasta-wheat",
    "name": "Wheat pasta",
    "category": "Grains & starches",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "rye",
    "name": "Rye",
    "category": "Grains & starches",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "barley",
    "name": "Barley",
    "category": "Grains & starches",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "couscous",
    "name": "Couscous (wheat)",
    "category": "Grains & starches",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "breakfast-cereal",
    "name": "Breakfast cereal",
    "category": "Grains & starches",
    "status": "avoid",
    "notes": "Most wheat-based cereals; check ingredients."
  },
  {
    "id": "pastries",
    "name": "Pastries / croissants",
    "category": "Grains & starches",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "rice",
    "name": "Rice",
    "category": "Grains & starches",
    "status": "ok",
    "notes": "White or brown."
  },
  {
    "id": "oats",
    "name": "Oats",
    "category": "Grains & starches",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "quinoa",
    "name": "Quinoa",
    "category": "Grains & starches",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "gf-bread",
    "name": "Gluten-free bread/pasta",
    "category": "Grains & starches",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "corn-tortilla",
    "name": "Corn tortilla",
    "category": "Grains & starches",
    "status": "ok",
    "notes": "Small serving."
  },
  {
    "id": "sourdough-spelt",
    "name": "Sourdough spelt bread",
    "category": "Grains & starches",
    "status": "ok",
    "notes": "Small serving; fermentation lowers FODMAPs."
  },
  {
    "id": "milk",
    "name": "Milk (cow/goat/sheep)",
    "category": "Dairy & alternatives",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "soft-cheese",
    "name": "Soft cheese (ricotta, cottage)",
    "category": "Dairy & alternatives",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "ice-cream",
    "name": "Ice cream",
    "category": "Dairy & alternatives",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "yoghurt",
    "name": "Yoghurt (regular)",
    "category": "Dairy & alternatives",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "cream",
    "name": "Cream / custard",
    "category": "Dairy & alternatives",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "condensed-milk",
    "name": "Condensed / evaporated milk",
    "category": "Dairy & alternatives",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "lactose-free-milk",
    "name": "Lactose-free milk",
    "category": "Dairy & alternatives",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "hard-cheese",
    "name": "Hard cheese (cheddar, parmesan)",
    "category": "Dairy & alternatives",
    "status": "ok",
    "notes": "Naturally low in lactose."
  },
  {
    "id": "brie",
    "name": "Brie / camembert",
    "category": "Dairy & alternatives",
    "status": "moderate",
    "notes": "Small serving."
  },
  {
    "id": "lactose-free-yoghurt",
    "name": "Lactose-free yoghurt",
    "category": "Dairy & alternatives",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "almond-milk",
    "name": "Almond milk",
    "category": "Dairy & alternatives",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "oat-milk",
    "name": "Oat milk",
    "category": "Dairy & alternatives",
    "status": "moderate",
    "notes": "Small serving; oats can add up."
  },
  {
    "id": "butter",
    "name": "Butter",
    "category": "Dairy & alternatives",
    "status": "ok",
    "notes": "Small amounts; contains negligible lactose."
  },
  {
    "id": "processed-meat",
    "name": "Processed meat (with onion/garlic filler)",
    "category": "Protein",
    "status": "avoid",
    "notes": "Check ingredient list."
  },
  {
    "id": "sausages",
    "name": "Sausages",
    "category": "Protein",
    "status": "avoid",
    "notes": "Check ingredients \u2014 often contain onion/garlic/wheat filler."
  },
  {
    "id": "kidney-beans",
    "name": "Kidney beans (large portion)",
    "category": "Protein",
    "status": "avoid",
    "notes": "OK in small, rinsed portions."
  },
  {
    "id": "baked-beans",
    "name": "Baked beans",
    "category": "Protein",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "marinated-meat",
    "name": "Marinated meat (onion/garlic-based)",
    "category": "Protein",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "plain-meat",
    "name": "Plain meat, poultry, fish",
    "category": "Protein",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "eggs",
    "name": "Eggs",
    "category": "Protein",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "tofu-firm",
    "name": "Firm tofu",
    "category": "Protein",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "lentils-canned",
    "name": "Canned lentils/chickpeas",
    "category": "Protein",
    "status": "moderate",
    "notes": "Small serving, rinsed."
  },
  {
    "id": "tempeh",
    "name": "Tempeh",
    "category": "Protein",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "cashews",
    "name": "Cashews",
    "category": "Nuts & seeds",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "pistachios",
    "name": "Pistachios",
    "category": "Nuts & seeds",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "almonds",
    "name": "Almonds",
    "category": "Nuts & seeds",
    "status": "moderate",
    "notes": "Max ~10."
  },
  {
    "id": "walnuts",
    "name": "Walnuts",
    "category": "Nuts & seeds",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "peanuts",
    "name": "Peanuts",
    "category": "Nuts & seeds",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "pumpkin-seeds",
    "name": "Pumpkin / sunflower / chia seeds",
    "category": "Nuts & seeds",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "honey",
    "name": "Honey",
    "category": "Sweeteners & snacks",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "hfcs",
    "name": "High-fructose corn syrup",
    "category": "Sweeteners & snacks",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "sugar-alcohols",
    "name": "Sorbitol / mannitol / xylitol (sugar-free gum)",
    "category": "Sweeteners & snacks",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "agave",
    "name": "Agave",
    "category": "Sweeteners & snacks",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "diet-products",
    "name": "\"Sugar-free / diet\" products",
    "category": "Sweeteners & snacks",
    "status": "avoid",
    "notes": "Usually contain sugar alcohols."
  },
  {
    "id": "maple-syrup",
    "name": "Maple syrup",
    "category": "Sweeteners & snacks",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "table-sugar",
    "name": "Table sugar (sucrose)",
    "category": "Sweeteners & snacks",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "dark-chocolate",
    "name": "Dark chocolate",
    "category": "Sweeteners & snacks",
    "status": "moderate",
    "notes": "Small square."
  },
  {
    "id": "rice-cakes",
    "name": "Plain rice cakes / popcorn",
    "category": "Sweeteners & snacks",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "carbonated",
    "name": "Carbonated / sparkling drinks",
    "category": "Drinks",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "alcohol",
    "name": "Alcohol (beer, wine, spirits)",
    "category": "Drinks",
    "status": "avoid",
    "notes": ""
  },
  {
    "id": "coffee-large",
    "name": "Coffee (large amounts)",
    "category": "Drinks",
    "status": "avoid",
    "notes": "Gut stimulant in large quantities."
  },
  {
    "id": "chai-fruit-tea",
    "name": "Chai / fruit tea blends",
    "category": "Drinks",
    "status": "avoid",
    "notes": "Some blends only \u2014 check ingredients."
  },
  {
    "id": "rum",
    "name": "Rum",
    "category": "Drinks",
    "status": "avoid",
    "notes": "High FODMAP relative to other spirits."
  },
  {
    "id": "water",
    "name": "Water",
    "category": "Drinks",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "black-green-tea",
    "name": "Black or green tea (weak)",
    "category": "Drinks",
    "status": "ok",
    "notes": ""
  },
  {
    "id": "peppermint-tea",
    "name": "Peppermint tea",
    "category": "Drinks",
    "status": "ok",
    "notes": "Can also help soothe symptoms."
  },
  {
    "id": "small-coffee",
    "name": "Small black coffee",
    "category": "Drinks",
    "status": "moderate",
    "notes": ""
  },
  {
    "id": "lactose-free-drinks",
    "name": "Lactose-free milk-based drinks",
    "category": "Drinks",
    "status": "ok",
    "notes": ""
  }
];

const STATUSES = ["ok", "moderate", "avoid"];
const MAX_NAME_LEN = 80;
const MAX_NOTES_LEN = 2000;

function withCors(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

function json(data, status) {
  return withCors(
    new Response(JSON.stringify(data), {
      status: status || 200,
      headers: { "Content-Type": "application/json" },
    })
  );
}

async function getFoods(env) {
  const raw = await env.FOODS_KV.get("foods");
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      // Corrupt data - fall through to reseed.
    }
  }
  await env.FOODS_KV.put("foods", JSON.stringify(SEED_FOODS));
  return SEED_FOODS;
}

async function saveFoods(env, foods) {
  await env.FOODS_KV.put("foods", JSON.stringify(foods));
}

function slugify(name) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "food"
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }));
    }

    if (url.pathname === "/api/foods" && request.method === "GET") {
      const foods = await getFoods(env);
      return json(foods);
    }

    if (url.pathname === "/api/foods" && request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return json({ error: "Invalid JSON body" }, 400);
      }

      const name = (body.name || "").toString().trim();
      const category = (body.category || "Other").toString().trim();
      const status = (body.status || "").toString().trim();
      const notes = (body.notes || "").toString().trim();

      if (!name) return json({ error: "Name is required" }, 400);
      if (name.length > MAX_NAME_LEN) return json({ error: "Name is too long" }, 400);
      if (notes.length > MAX_NOTES_LEN) return json({ error: "Notes are too long" }, 400);
      if (!STATUSES.includes(status)) return json({ error: "Status must be ok, moderate, or avoid" }, 400);

      const foods = await getFoods(env);
      let id = (body.id || "").toString().trim();

      if (id) {
        const idx = foods.findIndex((f) => f.id === id);
        if (idx >= 0) {
          foods[idx] = { id, name, category, status, notes };
        } else {
          foods.push({ id, name, category, status, notes });
        }
      } else {
        id = slugify(name) + "-" + Date.now().toString(36);
        foods.push({ id, name, category, status, notes });
      }

      await saveFoods(env, foods);
      return json({ id, foods });
    }

    if (url.pathname.startsWith("/api/foods/") && request.method === "DELETE") {
      const id = decodeURIComponent(url.pathname.split("/").pop());
      const foods = await getFoods(env);
      const next = foods.filter((f) => f.id !== id);
      await saveFoods(env, next);
      return json({ foods: next });
    }

    return json({ error: "Not found" }, 404);
  },
};
