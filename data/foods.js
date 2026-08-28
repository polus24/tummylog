// TummyLog default food database
// status: "avoid" | "moderate" | "ok"
// This is a starting reference (low-FODMAP framework). Users can add their own
// foods and personal notes, which are stored separately in localStorage and
// layered on top of this list.

const DEFAULT_FOODS = [
  // Fruits
  { id: "apple", name: "Apple", category: "Fruits", status: "avoid", tip: "High fructose and sorbitol." },
  { id: "pear", name: "Pear", category: "Fruits", status: "avoid", tip: "High fructose and sorbitol." },
  { id: "mango", name: "Mango", category: "Fruits", status: "avoid", tip: "High fructose." },
  { id: "watermelon", name: "Watermelon", category: "Fruits", status: "avoid", tip: "High in fructans." },
  { id: "cherries", name: "Cherries", category: "Fruits", status: "avoid", tip: "High sorbitol." },
  { id: "peach", name: "Peach", category: "Fruits", status: "avoid", tip: "Stone fruit, high sorbitol." },
  { id: "plum", name: "Plum", category: "Fruits", status: "avoid", tip: "Stone fruit, high sorbitol." },
  { id: "apricot", name: "Apricot", category: "Fruits", status: "avoid", tip: "Stone fruit, high sorbitol." },
  { id: "dried-fruit", name: "Dried fruit", category: "Fruits", status: "avoid", tip: "Concentrated FODMAPs." },
  { id: "fruit-juice", name: "Fruit juice", category: "Fruits", status: "avoid", tip: "Large amounts concentrate fructose." },
  { id: "avocado", name: "Avocado", category: "Fruits", status: "avoid", tip: "OK in small amounts (~1/8), high FODMAP in large portions." },
  { id: "banana", name: "Banana", category: "Fruits", status: "moderate", tip: "Best when firm/underripe; ripe bananas are higher FODMAP." },
  { id: "blueberries", name: "Blueberries", category: "Fruits", status: "ok", tip: "" },
  { id: "strawberries", name: "Strawberries", category: "Fruits", status: "ok", tip: "" },
  { id: "grapes", name: "Grapes", category: "Fruits", status: "ok", tip: "" },
  { id: "orange", name: "Orange", category: "Fruits", status: "ok", tip: "" },
  { id: "mandarin", name: "Mandarin", category: "Fruits", status: "ok", tip: "" },
  { id: "kiwi", name: "Kiwi", category: "Fruits", status: "ok", tip: "" },
  { id: "pineapple", name: "Pineapple", category: "Fruits", status: "ok", tip: "" },
  { id: "cantaloupe", name: "Cantaloupe", category: "Fruits", status: "ok", tip: "" },
  { id: "honeydew", name: "Honeydew melon", category: "Fruits", status: "ok", tip: "" },

  // Vegetables
  { id: "onion", name: "Onion", category: "Vegetables", status: "avoid", tip: "All forms, including powder." },
  { id: "garlic", name: "Garlic", category: "Vegetables", status: "avoid", tip: "All forms, including powder." },
  { id: "cauliflower", name: "Cauliflower", category: "Vegetables", status: "avoid", tip: "" },
  { id: "mushrooms", name: "Mushrooms", category: "Vegetables", status: "avoid", tip: "" },
  { id: "asparagus", name: "Asparagus", category: "Vegetables", status: "avoid", tip: "" },
  { id: "artichoke", name: "Artichoke", category: "Vegetables", status: "avoid", tip: "" },
  { id: "leek", name: "Leek", category: "Vegetables", status: "avoid", tip: "Green tops OK in small amounts." },
  { id: "spring-onion-white", name: "Spring onion (white part)", category: "Vegetables", status: "avoid", tip: "Green part is lower FODMAP." },
  { id: "savoy-cabbage", name: "Savoy cabbage", category: "Vegetables", status: "avoid", tip: "" },
  { id: "carrot", name: "Carrot", category: "Vegetables", status: "ok", tip: "" },
  { id: "potato", name: "Potato", category: "Vegetables", status: "ok", tip: "" },
  { id: "zucchini", name: "Zucchini", category: "Vegetables", status: "ok", tip: "" },
  { id: "cucumber", name: "Cucumber", category: "Vegetables", status: "ok", tip: "" },
  { id: "bell-pepper", name: "Bell pepper", category: "Vegetables", status: "ok", tip: "" },
  { id: "tomato", name: "Tomato", category: "Vegetables", status: "ok", tip: "" },
  { id: "spinach", name: "Spinach", category: "Vegetables", status: "ok", tip: "" },
  { id: "kale", name: "Kale", category: "Vegetables", status: "ok", tip: "" },
  { id: "green-beans", name: "Green beans", category: "Vegetables", status: "ok", tip: "" },
  { id: "bok-choy", name: "Bok choy", category: "Vegetables", status: "ok", tip: "" },
  { id: "eggplant", name: "Eggplant", category: "Vegetables", status: "ok", tip: "" },
  { id: "bean-sprouts", name: "Bean sprouts", category: "Vegetables", status: "ok", tip: "" },

  // Grains & starches
  { id: "wheat-bread", name: "Wheat bread", category: "Grains & starches", status: "avoid", tip: "" },
  { id: "pasta-wheat", name: "Wheat pasta", category: "Grains & starches", status: "avoid", tip: "" },
  { id: "rye", name: "Rye", category: "Grains & starches", status: "avoid", tip: "" },
  { id: "barley", name: "Barley", category: "Grains & starches", status: "avoid", tip: "" },
  { id: "couscous", name: "Couscous (wheat)", category: "Grains & starches", status: "avoid", tip: "" },
  { id: "breakfast-cereal", name: "Breakfast cereal", category: "Grains & starches", status: "avoid", tip: "Most wheat-based cereals; check ingredients." },
  { id: "pastries", name: "Pastries / croissants", category: "Grains & starches", status: "avoid", tip: "" },
  { id: "rice", name: "Rice", category: "Grains & starches", status: "ok", tip: "White or brown." },
  { id: "oats", name: "Oats", category: "Grains & starches", status: "ok", tip: "" },
  { id: "quinoa", name: "Quinoa", category: "Grains & starches", status: "ok", tip: "" },
  { id: "gf-bread", name: "Gluten-free bread/pasta", category: "Grains & starches", status: "ok", tip: "" },
  { id: "corn-tortilla", name: "Corn tortilla", category: "Grains & starches", status: "ok", tip: "Small serving." },
  { id: "sourdough-spelt", name: "Sourdough spelt bread", category: "Grains & starches", status: "ok", tip: "Small serving; fermentation lowers FODMAPs." },

  // Dairy & alternatives
  { id: "milk", name: "Milk (cow/goat/sheep)", category: "Dairy & alternatives", status: "avoid", tip: "" },
  { id: "soft-cheese", name: "Soft cheese (ricotta, cottage)", category: "Dairy & alternatives", status: "avoid", tip: "" },
  { id: "ice-cream", name: "Ice cream", category: "Dairy & alternatives", status: "avoid", tip: "" },
  { id: "yoghurt", name: "Yoghurt (regular)", category: "Dairy & alternatives", status: "avoid", tip: "" },
  { id: "cream", name: "Cream / custard", category: "Dairy & alternatives", status: "avoid", tip: "" },
  { id: "condensed-milk", name: "Condensed / evaporated milk", category: "Dairy & alternatives", status: "avoid", tip: "" },
  { id: "lactose-free-milk", name: "Lactose-free milk", category: "Dairy & alternatives", status: "ok", tip: "" },
  { id: "hard-cheese", name: "Hard cheese (cheddar, parmesan)", category: "Dairy & alternatives", status: "ok", tip: "Naturally low in lactose." },
  { id: "brie", name: "Brie / camembert", category: "Dairy & alternatives", status: "moderate", tip: "Small serving." },
  { id: "lactose-free-yoghurt", name: "Lactose-free yoghurt", category: "Dairy & alternatives", status: "ok", tip: "" },
  { id: "almond-milk", name: "Almond milk", category: "Dairy & alternatives", status: "ok", tip: "" },
  { id: "oat-milk", name: "Oat milk", category: "Dairy & alternatives", status: "moderate", tip: "Small serving; oats can add up." },
  { id: "butter", name: "Butter", category: "Dairy & alternatives", status: "ok", tip: "Small amounts; contains negligible lactose." },

  // Protein
  { id: "processed-meat", name: "Processed meat (with onion/garlic filler)", category: "Protein", status: "avoid", tip: "Check ingredient list." },
  { id: "sausages", name: "Sausages", category: "Protein", status: "avoid", tip: "Check ingredients — often contain onion/garlic/wheat filler." },
  { id: "kidney-beans", name: "Kidney beans (large portion)", category: "Protein", status: "avoid", tip: "OK in small, rinsed portions." },
  { id: "baked-beans", name: "Baked beans", category: "Protein", status: "avoid", tip: "" },
  { id: "marinated-meat", name: "Marinated meat (onion/garlic-based)", category: "Protein", status: "avoid", tip: "" },
  { id: "plain-meat", name: "Plain meat, poultry, fish", category: "Protein", status: "ok", tip: "" },
  { id: "eggs", name: "Eggs", category: "Protein", status: "ok", tip: "" },
  { id: "tofu-firm", name: "Firm tofu", category: "Protein", status: "ok", tip: "" },
  { id: "lentils-canned", name: "Canned lentils/chickpeas", category: "Protein", status: "moderate", tip: "Small serving, rinsed." },
  { id: "tempeh", name: "Tempeh", category: "Protein", status: "ok", tip: "" },

  // Nuts & seeds
  { id: "cashews", name: "Cashews", category: "Nuts & seeds", status: "avoid", tip: "" },
  { id: "pistachios", name: "Pistachios", category: "Nuts & seeds", status: "avoid", tip: "" },
  { id: "almonds", name: "Almonds", category: "Nuts & seeds", status: "moderate", tip: "Max ~10." },
  { id: "walnuts", name: "Walnuts", category: "Nuts & seeds", status: "ok", tip: "" },
  { id: "peanuts", name: "Peanuts", category: "Nuts & seeds", status: "ok", tip: "" },
  { id: "pumpkin-seeds", name: "Pumpkin / sunflower / chia seeds", category: "Nuts & seeds", status: "ok", tip: "" },

  // Sweeteners & snacks
  { id: "honey", name: "Honey", category: "Sweeteners & snacks", status: "avoid", tip: "" },
  { id: "hfcs", name: "High-fructose corn syrup", category: "Sweeteners & snacks", status: "avoid", tip: "" },
  { id: "sugar-alcohols", name: "Sorbitol / mannitol / xylitol (sugar-free gum)", category: "Sweeteners & snacks", status: "avoid", tip: "" },
  { id: "agave", name: "Agave", category: "Sweeteners & snacks", status: "avoid", tip: "" },
  { id: "diet-products", name: "\"Sugar-free / diet\" products", category: "Sweeteners & snacks", status: "avoid", tip: "Usually contain sugar alcohols." },
  { id: "maple-syrup", name: "Maple syrup", category: "Sweeteners & snacks", status: "ok", tip: "" },
  { id: "table-sugar", name: "Table sugar (sucrose)", category: "Sweeteners & snacks", status: "ok", tip: "" },
  { id: "dark-chocolate", name: "Dark chocolate", category: "Sweeteners & snacks", status: "moderate", tip: "Small square." },
  { id: "rice-cakes", name: "Plain rice cakes / popcorn", category: "Sweeteners & snacks", status: "ok", tip: "" },

  // Drinks
  { id: "carbonated", name: "Carbonated / sparkling drinks", category: "Drinks", status: "avoid", tip: "" },
  { id: "alcohol", name: "Alcohol (beer, wine, spirits)", category: "Drinks", status: "avoid", tip: "" },
  { id: "coffee-large", name: "Coffee (large amounts)", category: "Drinks", status: "avoid", tip: "Gut stimulant in large quantities." },
  { id: "chai-fruit-tea", name: "Chai / fruit tea blends", category: "Drinks", status: "avoid", tip: "Some blends only — check ingredients." },
  { id: "rum", name: "Rum", category: "Drinks", status: "avoid", tip: "High FODMAP relative to other spirits." },
  { id: "water", name: "Water", category: "Drinks", status: "ok", tip: "" },
  { id: "black-green-tea", name: "Black or green tea (weak)", category: "Drinks", status: "ok", tip: "" },
  { id: "peppermint-tea", name: "Peppermint tea", category: "Drinks", status: "ok", tip: "Can also help soothe symptoms." },
  { id: "small-coffee", name: "Small black coffee", category: "Drinks", status: "moderate", tip: "" },
  { id: "lactose-free-drinks", name: "Lactose-free milk-based drinks", category: "Drinks", status: "ok", tip: "" },
];

if (typeof module !== "undefined") module.exports = DEFAULT_FOODS;
