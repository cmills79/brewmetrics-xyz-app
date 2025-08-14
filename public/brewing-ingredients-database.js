// Comprehensive Brewing Ingredients Database
class BrewingIngredientsDatabase {
    static ingredients = {
            fermentables: [
                // Base Malts
                { name: 'American 2-Row', supplier: 'Briess', type: 'Base Malt', yield: 81, color: 2, price: 1.20 },
                { name: 'Pilsner Malt', supplier: 'Weyermann', type: 'Base Malt', yield: 82, color: 2, price: 1.35 },
                { name: 'Maris Otter', supplier: 'Crisp', type: 'Base Malt', yield: 80, color: 3, price: 1.45 },
                { name: 'Munich Malt', supplier: 'Weyermann', type: 'Base Malt', yield: 80, color: 9, price: 1.40 },
                { name: 'Vienna Malt', supplier: 'Briess', type: 'Base Malt', yield: 80, color: 4, price: 1.35 },
                
                // Crystal/Caramel Malts
                { name: 'Crystal 40L', supplier: 'Briess', type: 'Crystal', yield: 75, color: 40, price: 1.85 },
                { name: 'Crystal 60L', supplier: 'Briess', type: 'Crystal', yield: 75, color: 60, price: 1.85 },
                { name: 'Crystal 80L', supplier: 'Briess', type: 'Crystal', yield: 75, color: 80, price: 1.90 },
                { name: 'Crystal 120L', supplier: 'Briess', type: 'Crystal', yield: 74, color: 120, price: 1.95 },
                { name: 'Caramunich I', supplier: 'Weyermann', type: 'Crystal', yield: 76, color: 37, price: 2.10 },
                
                // Specialty Malts
                { name: 'Chocolate Malt', supplier: 'Briess', type: 'Roasted', yield: 70, color: 350, price: 2.25 },
                { name: 'Black Patent', supplier: 'Briess', type: 'Roasted', yield: 70, color: 500, price: 2.30 },
                { name: 'Roasted Barley', supplier: 'Briess', type: 'Roasted', yield: 70, color: 300, price: 2.20 },
                { name: 'Carafa Special II', supplier: 'Weyermann', type: 'Roasted', yield: 70, color: 415, price: 2.45 },
                { name: 'Wheat Malt', supplier: 'Briess', type: 'Specialty', yield: 85, color: 2, price: 1.55 },
                { name: 'Flaked Oats', supplier: 'Briess', type: 'Adjunct', yield: 70, color: 1, price: 2.10 },
                { name: 'Flaked Wheat', supplier: 'Briess', type: 'Adjunct', yield: 75, color: 2, price: 1.95 }
            ],
            
            hops: [
                // American Hops
                { name: 'Cascade', origin: 'USA', alpha: 5.5, type: 'Dual', profile: 'Citrus, Floral', price: 15.00 },
                { name: 'Centennial', origin: 'USA', alpha: 10.0, type: 'Dual', profile: 'Citrus, Floral', price: 16.50 },
                { name: 'Chinook', origin: 'USA', alpha: 13.0, type: 'Bittering', profile: 'Spicy, Grapefruit', price: 17.00 },
                { name: 'Columbus', origin: 'USA', alpha: 14.0, type: 'Bittering', profile: 'Pungent, Earthy', price: 16.50 },
                { name: 'Citra', origin: 'USA', alpha: 12.0, type: 'Aroma', profile: 'Tropical, Citrus', price: 18.00 },
                { name: 'Mosaic', origin: 'USA', alpha: 12.25, type: 'Aroma', profile: 'Tropical, Berry', price: 18.50 },
                { name: 'Simcoe', origin: 'USA', alpha: 13.0, type: 'Dual', profile: 'Pine, Passion Fruit', price: 17.50 },
                { name: 'Amarillo', origin: 'USA', alpha: 9.2, type: 'Aroma', profile: 'Orange, Floral', price: 17.00 },
                
                // European Hops
                { name: 'Saaz', origin: 'Czech', alpha: 3.5, type: 'Aroma', profile: 'Spicy, Herbal', price: 14.50 },
                { name: 'Hallertau Mittelfrüh', origin: 'Germany', alpha: 4.0, type: 'Aroma', profile: 'Mild, Herbal', price: 15.50 },
                { name: 'Tettnang', origin: 'Germany', alpha: 4.5, type: 'Aroma', profile: 'Mild, Spicy', price: 15.00 },
                { name: 'East Kent Goldings', origin: 'UK', alpha: 5.0, type: 'Aroma', profile: 'Honey, Spicy', price: 16.00 },
                { name: 'Fuggles', origin: 'UK', alpha: 4.5, type: 'Aroma', profile: 'Mild, Earthy', price: 14.50 },
                
                // New World Hops
                { name: 'Galaxy', origin: 'Australia', alpha: 14.0, type: 'Aroma', profile: 'Tropical, Passion Fruit', price: 19.00 },
                { name: 'Nelson Sauvin', origin: 'New Zealand', alpha: 12.0, type: 'Aroma', profile: 'Wine, Tropical', price: 20.00 },
                { name: 'Motueka', origin: 'New Zealand', alpha: 7.0, type: 'Aroma', profile: 'Lime, Tropical', price: 18.50 }
            ],
            
            yeast: [
                // Dry Ale Yeasts
                { name: 'Safale US-05', lab: 'Fermentis', type: 'American Ale', form: 'Dry', attenuation: 81, temp: '59-75°F', price: 3.50 },
                { name: 'Safale S-04', lab: 'Fermentis', type: 'English Ale', form: 'Dry', attenuation: 75, temp: '59-75°F', price: 3.50 },
                { name: 'Safale K-97', lab: 'Fermentis', type: 'German Ale', form: 'Dry', attenuation: 83, temp: '59-77°F', price: 3.50 },
                { name: 'Nottingham', lab: 'Lallemand', type: 'English Ale', form: 'Dry', attenuation: 79, temp: '57-70°F', price: 3.25 },
                
                // Liquid Ale Yeasts
                { name: 'California Ale', lab: 'Wyeast', type: 'American Ale', form: 'Liquid', attenuation: 76, temp: '60-72°F', price: 8.00 },
                { name: 'London Ale III', lab: 'Wyeast', type: 'English Ale', form: 'Liquid', attenuation: 75, temp: '64-75°F', price: 8.00 },
                { name: 'German Ale', lab: 'Wyeast', type: 'German Ale', form: 'Liquid', attenuation: 83, temp: '56-70°F', price: 8.00 },
                { name: 'Vermont Ale', lab: 'Conan', type: 'New England', form: 'Liquid', attenuation: 75, temp: '66-72°F', price: 10.00 },
                
                // Lager Yeasts
                { name: 'Saflager W-34/70', lab: 'Fermentis', type: 'German Lager', form: 'Dry', attenuation: 83, temp: '48-59°F', price: 4.00 },
                { name: 'Saflager S-23', lab: 'Fermentis', type: 'German Lager', form: 'Dry', attenuation: 82, temp: '48-59°F', price: 4.00 },
                { name: 'Pilsen Lager', lab: 'Wyeast', type: 'Czech Lager', form: 'Liquid', attenuation: 75, temp: '50-58°F', price: 8.50 }
            ],
            
            chemicals: [
                // Water Treatment
                { name: 'Gypsum (CaSO4)', supplier: 'LD Carlson', type: 'Water Treatment', use: 'Increases sulfate, calcium', price: 2.50 },
                { name: 'Calcium Chloride', supplier: 'LD Carlson', type: 'Water Treatment', use: 'Increases chloride, calcium', price: 3.00 },
                { name: 'Epsom Salt (MgSO4)', supplier: 'LD Carlson', type: 'Water Treatment', use: 'Increases sulfate, magnesium', price: 2.25 },
                { name: 'Baking Soda (NaHCO3)', supplier: 'LD Carlson', type: 'Water Treatment', use: 'Increases alkalinity', price: 2.00 },
                { name: 'Chalk (CaCO3)', supplier: 'LD Carlson', type: 'Water Treatment', use: 'Increases alkalinity, calcium', price: 2.00 },
                
                // Acids
                { name: 'Lactic Acid 88%', supplier: 'LD Carlson', type: 'Acid', use: 'pH reduction', price: 4.50 },
                { name: 'Phosphoric Acid 10%', supplier: 'Five Star', type: 'Acid', use: 'pH reduction', price: 5.00 },
                
                // Cleaners & Sanitizers
                { name: 'PBW (Powdered Brewery Wash)', supplier: 'Five Star', type: 'Cleaner', use: 'Alkaline cleaner', price: 4.20 },
                { name: 'Star San', supplier: 'Five Star', type: 'Sanitizer', use: 'Acid sanitizer', price: 12.50 },
                { name: 'Iodophor', supplier: 'LD Carlson', type: 'Sanitizer', use: 'Iodine sanitizer', price: 8.00 },
                { name: 'One Step', supplier: 'LD Carlson', type: 'Cleaner', use: 'No-rinse cleaner', price: 6.50 },
                
                // Nutrients & Additives
                { name: 'Yeast Nutrient', supplier: 'LD Carlson', type: 'Nutrient', use: 'Yeast health', price: 3.50 },
                { name: 'Yeast Energizer', supplier: 'LD Carlson', type: 'Nutrient', use: 'Yeast vitality', price: 4.00 },
                { name: 'Irish Moss', supplier: 'LD Carlson', type: 'Fining', use: 'Protein coagulation', price: 3.25 },
                { name: 'Whirlfloc Tablets', supplier: 'LD Carlson', type: 'Fining', use: 'Protein coagulation', price: 8.50 }
            ]
    };

    constructor() {}

    _getIngredientsForCategory(category) {
        return BrewingIngredientsDatabase.ingredients[category] || [];
    }

    getIngredientsByCategory(category) {
        return this._getIngredientsForCategory(category);
    }

    searchIngredients(category, query) {
        const ingredients = this._getIngredientsForCategory(category);
        return ingredients.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.supplier?.toLowerCase().includes(query.toLowerCase()) ||
            item.type?.toLowerCase().includes(query.toLowerCase())
        );
    }

    getIngredientByName(category, name) {
        const ingredients = this._getIngredientsForCategory(category);
        return ingredients.find(ingredient => ingredient.name.toLowerCase() === name.toLowerCase());
    }
}

// Create global instance
if (typeof window !== 'undefined') {
    window.brewingIngredientsDB = new BrewingIngredientsDatabase();
}