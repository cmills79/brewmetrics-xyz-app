import json
import os

# This list now contains the data for all 50 recipes.
recipes_data = [
    {
        "recipe_id": "AmericanBlondeAle_20240805_01",
        "recipe_name": "American Blonde Ale",
        "beer_style": {"primary_style": "American Blonde Ale", "bjcp_code": "18A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.048, "final_gravity_sg": 1.011, "abv_percent": 4.9, "ibu_tinseth": 22, "srm_morey": 4},
        "ingredients": {
            "fermentables": [
                {"name": "American 2-Row Pale Malt", "weight_lbs": 550, "percentage": 85.0, "type": "Base Malt", "yield_percent": 80.0, "color_lovibond": 1.8},
                {"name": "German Pilsner Malt", "weight_lbs": 65, "percentage": 10.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5},
                {"name": "Carapils/Dextrine Malt", "weight_lbs": 32, "percentage": 5.0, "type": "Specialty Malt", "yield_percent": 72.0, "color_lovibond": 1.5}
            ],
            "hops": [
                {"name": "Willamette", "alpha_acid_percent": 5.0, "amount_oz": 24, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 16 IBU"},
                {"name": "Cascade", "alpha_acid_percent": 6.0, "amount_oz": 28, "use": "Boil", "time_minutes": 10, "notes": "Aroma: 6 IBU"}
            ],
            "yeast": {"name": "WLP001 California Ale Yeast", "lab": "White Labs", "strain_code": "WLP001", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.0, "attenuation_percent": 80.0, "flocculation": "Medium", "optimum_temp_f": "68-73"},
            "water_chemistry": {"target_profile_name": "Light & Crisp Ale Profile", "starting_water_ph": 7.0, "mash_ph": 5.3, "ions_ppm": {"calcium": 75, "magnesium": 5, "sodium": 10, "sulfate": 50, "chloride": 75}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 150, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 67, "duration_days": 8}, {"name": "Cold Crash", "temperature_f": 35, "duration_days": 2}]
        },
        "notes": {"brewing_notes": "A straightforward, clean ale. The blend of 2-Row and Pilsner provides a clean, slightly grainy base. The hop schedule provides balance without being assertive. For a crisper finish, lower the mash temperature to 148°F (64°C).", "tasting_notes": "A clean, crisp, and refreshing ale with a light grainy malt sweetness and a balanced, low hop bitterness and flavor."}
    },
    {
        "recipe_id": "CreamAle_20240805_02",
        "recipe_name": "Cream Ale",
        "beer_style": {"primary_style": "Cream Ale", "bjcp_code": "1C"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.050, "final_gravity_sg": 1.008, "abv_percent": 5.5, "ibu_tinseth": 18, "srm_morey": 3},
        "ingredients": {
            "fermentables": [
                {"name": "American 6-Row Malt", "weight_lbs": 480, "percentage": 70.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 1.8},
                {"name": "Flaked Corn", "weight_lbs": 137, "percentage": 20.0, "type": "Adjunct", "yield_percent": 86.0, "color_lovibond": 0.5},
                {"name": "Pilsner Malt", "weight_lbs": 69, "percentage": 10.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5}
            ],
            "hops": [
                {"name": "Liberty", "alpha_acid_percent": 4.0, "amount_oz": 24, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 15 IBU"},
                {"name": "Liberty", "alpha_acid_percent": 4.0, "amount_oz": 16, "use": "Boil", "time_minutes": 5, "notes": "Aroma: 3 IBU"}
            ],
            "yeast": {"name": "Cream Ale Yeast Blend", "lab": "White Labs", "strain_code": "WLP080", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 75.0, "flocculation": "Medium", "optimum_temp_f": "65-70"},
            "water_chemistry": {"target_profile_name": "Light American Ale Profile", "starting_water_ph": 7.0, "mash_ph": 5.3, "ions_ppm": {"calcium": 50, "magnesium": 5, "sodium": 10, "sulfate": 60, "chloride": 60}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Step 1", "temperature_f": 131, "duration_minutes": 15, "type": "Step"}, {"name": "Step 2", "temperature_f": 150, "duration_minutes": 60, "type": "Step"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 68, "duration_days": 7}, {"name": "Lager", "temperature_f": 35, "duration_days": 14}]
        },
        "notes": {"brewing_notes": "The 6-Row malt provides the enzymatic power to convert the large corn adjunct addition. The step mash aids in breaking down the corn. A cereal mash for the flaked corn is recommended on systems with an adjunct cooker.", "tasting_notes": "A very light-bodied, crisp, and highly drinkable beer."}
    },
    {
        "recipe_id": "Kolsch_20240805_03",
        "recipe_name": "Kölsch",
        "beer_style": {"primary_style": "Kölsch", "bjcp_code": "5B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.046, "final_gravity_sg": 1.009, "abv_percent": 4.9, "ibu_tinseth": 24, "srm_morey": 4},
        "ingredients": {
            "fermentables": [
                {"name": "German Pilsner Malt", "weight_lbs": 600, "percentage": 95.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5},
                {"name": "German Vienna Malt", "weight_lbs": 32, "percentage": 5.0, "type": "Base Malt", "yield_percent": 79.0, "color_lovibond": 3.5}
            ],
            "hops": [
                {"name": "Hallertau Mittelfrüh", "alpha_acid_percent": 4.0, "amount_oz": 24, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 15 IBU"},
                {"name": "Tettnanger", "alpha_acid_percent": 4.5, "amount_oz": 32, "use": "Boil", "time_minutes": 15, "notes": "Aroma: 9 IBU"}
            ],
            "yeast": {"name": "German Ale/Kölsch Yeast", "lab": "White Labs", "strain_code": "WLP029", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.0, "attenuation_percent": 72.0, "flocculation": "Medium-Low", "optimum_temp_f": "65-69"},
            "water_chemistry": {"target_profile_name": "Kölsch Profile", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 50, "magnesium": 10, "sodium": 16, "sulfate": 70, "chloride": 70}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Step 1", "temperature_f": 145, "duration_minutes": 20, "type": "Step"}, {"name": "Step 2", "temperature_f": 154, "duration_minutes": 40, "type": "Step"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 60, "duration_days": 12}, {"name": "Lager", "temperature_f": 34, "duration_days": 28}]
        },
        "notes": {"brewing_notes": "A hybrid style fermented with an ale yeast at cooler temperatures. The key is a clean fermentation and extended cold conditioning (lagering) to produce a crisp, lager-like finish.", "tasting_notes": "A clean, smooth profile with subtle fruity esters and a crisp, lager-like finish."}
    },
    {
        "recipe_id": "AmericanPaleAle_20240805_04",
        "recipe_name": "American Pale Ale",
        "beer_style": {"primary_style": "American Pale Ale", "bjcp_code": "18B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.050, "final_gravity_sg": 1.011, "abv_percent": 5.1, "ibu_tinseth": 38, "srm_morey": 8},
        "ingredients": {
            "fermentables": [
                {"name": "American 2-Row Pale Malt", "weight_lbs": 600, "percentage": 90.0, "type": "Base Malt", "yield_percent": 80.0, "color_lovibond": 1.8},
                {"name": "Crystal Malt (40L)", "weight_lbs": 67, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 75.0, "color_lovibond": 40}
            ],
            "hops": [
                {"name": "Magnum", "alpha_acid_percent": 14.0, "amount_oz": 19.2, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 25 IBU"},
                {"name": "Cascade", "alpha_acid_percent": 6.0, "amount_oz": 32, "use": "Boil", "time_minutes": 10, "notes": "Aroma: 8 IBU"},
                {"name": "Cascade", "alpha_acid_percent": 6.0, "amount_oz": 48, "use": "Whirlpool", "time_minutes": 20, "temperature_f": 180, "notes": "Aroma: 5 IBU"},
                {"name": "Cascade", "alpha_acid_percent": 6.0, "amount_oz": 64, "use": "Dry Hop", "time_days": 3, "notes": "Aroma"}
            ],
            "yeast": {"name": "California Ale Yeast", "lab": "White Labs", "strain_code": "WLP001", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 80.0, "flocculation": "Medium", "optimum_temp_f": "68-73"},
            "water_chemistry": {"target_profile_name": "Hoppy Pale Ale Profile", "starting_water_ph": 7.0, "mash_ph": 5.3, "ions_ppm": {"calcium": 100, "magnesium": 15, "sodium": 10, "sulfate": 150, "chloride": 50}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 152, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 68, "duration_days": 8}]
        },
        "notes": {"brewing_notes": "The quintessential American craft style. The water profile with a ~3:1 sulfate-to-chloride ratio accentuates a crisp hop bitterness. The late hop additions provide the signature citrus and floral Cascade aroma.", "tasting_notes": "A classic American Pale Ale with a firm hop bitterness and signature citrus and floral aromas from Cascade hops, supported by a clean malt backbone."}
    },
    {
        "recipe_id": "WestCoastIPA_20240805_05",
        "recipe_name": "West Coast IPA",
        "beer_style": {"primary_style": "American IPA", "bjcp_code": "21A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.065, "final_gravity_sg": 1.011, "abv_percent": 7.1, "ibu_tinseth": 65, "srm_morey": 6},
        "ingredients": {
            "fermentables": [
                {"name": "American 2-Row Pale Malt", "weight_lbs": 800, "percentage": 94.0, "type": "Base Malt", "yield_percent": 80.0, "color_lovibond": 1.8},
                {"name": "Carapils/Dextrine Malt", "weight_lbs": 51, "percentage": 6.0, "type": "Specialty Malt", "yield_percent": 72.0, "color_lovibond": 1.5}
            ],
            "hops": [
                {"name": "Warrior", "alpha_acid_percent": 16.0, "amount_oz": 48, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 40 IBU"},
                {"name": "Centennial", "alpha_acid_percent": 10.0, "amount_oz": 32, "use": "Boil", "time_minutes": 15, "notes": "Flavor: 12 IBU"},
                {"name": "Simcoe", "alpha_acid_percent": 13.0, "amount_oz": 64, "use": "Whirlpool", "time_minutes": 30, "temperature_f": 185, "notes": "Aroma: 13 IBU (split)"},
                {"name": "Centennial", "alpha_acid_percent": 10.0, "amount_oz": 64, "use": "Whirlpool", "time_minutes": 30, "temperature_f": 185, "notes": "Aroma: 13 IBU (split)"},
                {"name": "Simcoe", "alpha_acid_percent": 13.0, "amount_oz": 96, "use": "Dry Hop", "time_days": 4, "notes": "Aroma"},
                {"name": "Citra", "alpha_acid_percent": 12.0, "amount_oz": 64, "use": "Dry Hop", "time_days": 4, "notes": "Aroma"}
            ],
            "yeast": {"name": "California Ale Yeast", "lab": "White Labs", "strain_code": "WLP001", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.0, "attenuation_percent": 80.0, "flocculation": "Medium", "optimum_temp_f": "68-73"},
            "water_chemistry": {"target_profile_name": "Assertive IPA Profile", "starting_water_ph": 7.0, "mash_ph": 5.2, "ions_ppm": {"calcium": 110, "magnesium": 18, "sodium": 16, "sulfate": 275, "chloride": 50}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 148, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 66, "duration_days": 8}]
        },
        "notes": {"brewing_notes": "A classic West Coast IPA is defined by its dryness, clarity, and assertive hop bitterness. The high sulfate water profile and low mash temperature are critical to achieving these characteristics. Ferment cool to maintain a clean yeast profile, allowing the hops to dominate.", "tasting_notes": "A dry, clear IPA with a dominant, assertive hop bitterness and prominent piney and citrusy hop flavors and aromas."}
    },
    {
        "recipe_id": "HazyIPA_20240805_06",
        "recipe_name": "Hazy IPA",
        "beer_style": {"primary_style": "Hazy IPA", "bjcp_code": "21C"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.066, "final_gravity_sg": 1.014, "abv_percent": 6.8, "ibu_tinseth": 45, "srm_morey": 5},
        "ingredients": {
            "fermentables": [
                {"name": "Maris Otter Malt", "weight_lbs": 600, "percentage": 70.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 3},
                {"name": "Flaked Oats", "weight_lbs": 129, "percentage": 15.0, "type": "Adjunct", "yield_percent": 70.0, "color_lovibond": 1},
                {"name": "White Wheat Malt", "weight_lbs": 129, "percentage": 15.0, "type": "Base Malt", "yield_percent": 84.0, "color_lovibond": 2}
            ],
            "hops": [
                {"name": "Magnum", "alpha_acid_percent": 14.0, "amount_oz": 12, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 15 IBU"},
                {"name": "Citra", "alpha_acid_percent": 12.0, "amount_oz": 96, "use": "Whirlpool", "time_minutes": 30, "temperature_f": 170, "notes": "Aroma: 30 IBU (split)"},
                {"name": "Mosaic", "alpha_acid_percent": 12.5, "amount_oz": 96, "use": "Whirlpool", "time_minutes": 30, "temperature_f": 170, "notes": "Aroma: 30 IBU (split)"},
                {"name": "Citra", "alpha_acid_percent": 12.0, "amount_oz": 96, "use": "Dry Hop", "time_days": 2, "notes": "Day 2 of Fermentation"},
                {"name": "Galaxy", "alpha_acid_percent": 15.0, "amount_oz": 64, "use": "Dry Hop", "time_days": 2, "notes": "Day 2 of Fermentation"},
                {"name": "Mosaic", "alpha_acid_percent": 12.5, "amount_oz": 96, "use": "Dry Hop", "time_days": 0, "notes": "Post-fermentation"},
                {"name": "Galaxy", "alpha_acid_percent": 15.0, "amount_oz": 64, "use": "Dry Hop", "time_days": 0, "notes": "Post-fermentation"}
            ],
            "yeast": {"name": "London Ale III", "lab": "Wyeast", "strain_code": "1318", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 75.0, "flocculation": "High", "optimum_temp_f": "64-74"},
            "water_chemistry": {"target_profile_name": "NEIPA Soft Profile", "starting_water_ph": 7.0, "mash_ph": 5.3, "ions_ppm": {"calcium": 100, "magnesium": 18, "sodium": 16, "sulfate": 100, "chloride": 200}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 154, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 68, "duration_days": 10, "notes": "The first dry hop addition during active fermentation is key for biotransformation."}]
        },
        "notes": {"brewing_notes": "The high chloride water, large oat and wheat additions, and low-flocculating English yeast strain all contribute to the characteristic soft mouthfeel and stable haze. Minimize oxygen exposure post-fermentation to preserve hop aroma and prevent browning.", "tasting_notes": "Intense fruity hop flavors with a soft, full mouthfeel and a characteristic haze."}
    },
    {
        "recipe_id": "ImperialIPA_20240805_07",
        "recipe_name": "Imperial IPA",
        "beer_style": {"primary_style": "Imperial IPA", "bjcp_code": "22A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 555, "post_boil_gallons": 488, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.085, "final_gravity_sg": 1.016, "abv_percent": 9.1, "ibu_tinseth": 105, "srm_morey": 9},
        "ingredients": {
            "fermentables": [
                {"name": "American 2-Row Pale Malt", "weight_lbs": 1100, "percentage": 88.0, "type": "Base Malt", "yield_percent": 80.0, "color_lovibond": 1.8},
                {"name": "Munich Malt", "weight_lbs": 100, "percentage": 8.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 10},
                {"name": "Dextrose (Corn Sugar)", "weight_lbs": 50, "percentage": 4.0, "type": "Sugar", "yield_percent": 100.0, "color_lovibond": 0}
            ],
            "hops": [
                {"name": "Columbus", "alpha_acid_percent": 15.0, "amount_oz": 80, "use": "Boil", "time_minutes": 90, "notes": "Bitterness: 65 IBU"},
                {"name": "Simcoe", "alpha_acid_percent": 13.0, "amount_oz": 48, "use": "Boil", "time_minutes": 30, "notes": "Flavor: 25 IBU"},
                {"name": "Centennial", "alpha_acid_percent": 10.0, "amount_oz": 96, "use": "Whirlpool", "time_minutes": 30, "temperature_f": 190, "notes": "Aroma: 15 IBU (split)"},
                {"name": "Simcoe", "alpha_acid_percent": 13.0, "amount_oz": 96, "use": "Whirlpool", "time_minutes": 30, "temperature_f": 190, "notes": "Aroma: 15 IBU (split)"},
                {"name": "Simcoe", "alpha_acid_percent": 13.0, "amount_oz": 128, "use": "Dry Hop", "time_days": 7, "notes": "Aroma"},
                {"name": "Centennial", "alpha_acid_percent": 10.0, "amount_oz": 96, "use": "Dry Hop", "time_days": 7, "notes": "Aroma"}
            ],
            "yeast": {"name": "California Ale Yeast", "lab": "White Labs", "strain_code": "WLP001", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.25, "attenuation_percent": 80.0, "flocculation": "Medium", "optimum_temp_f": "68-73"},
            "water_chemistry": {"target_profile_name": "High Sulfate DIPA Profile", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 120, "magnesium": 20, "sodium": 15, "sulfate": 300, "chloride": 75}, "additions": []},
            "other_ingredients": [{"name": "Dextrose (Corn Sugar)", "amount_lbs": 50, "use": "Kettle"}]
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 149, "duration_minutes": 75, "type": "Infusion"}],
            "boil_duration_minutes": 90,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 67, "duration_days": 10, "notes": "Ensure proper yeast health and oxygenation due to the high gravity wort."}]
        },
        "notes": {"brewing_notes": "A high-gravity brew that pushes the limits of hop bitterness and aroma. The dextrose addition helps to dry out the beer and boost the ABV without adding excessive body. Expect significant wort loss due to hop absorption.", "tasting_notes": "A very strong, hop-forward ale with intense bitterness and aroma, a dry finish, and noticeable alcohol warmth."}
    },
    {
        "recipe_id": "EnglishIPA_20240805_08",
        "recipe_name": "English IPA",
        "beer_style": {"primary_style": "English IPA", "bjcp_code": "12C"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.062, "final_gravity_sg": 1.014, "abv_percent": 6.3, "ibu_tinseth": 55, "srm_morey": 11},
        "ingredients": {
            "fermentables": [
                {"name": "Maris Otter Pale Ale Malt", "weight_lbs": 850, "percentage": 90.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 3},
                {"name": "British Crystal Malt (60L)", "weight_lbs": 94, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 74.0, "color_lovibond": 60}
            ],
            "hops": [
                {"name": "Target", "alpha_acid_percent": 10.0, "amount_oz": 72, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 45 IBU"},
                {"name": "Fuggle", "alpha_acid_percent": 4.5, "amount_oz": 64, "use": "Boil", "time_minutes": 10, "notes": "Flavor: 10 IBU"},
                {"name": "East Kent Goldings", "alpha_acid_percent": 5.0, "amount_oz": 80, "use": "Dry Hop", "time_days": 5, "notes": "Aroma"}
            ],
            "yeast": {"name": "London ESB Ale", "lab": "Wyeast", "strain_code": "1968", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 73.0, "flocculation": "Very High", "optimum_temp_f": "64-72"},
            "water_chemistry": {"target_profile_name": "Burton-on-Trent", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 110, "magnesium": 18, "sodium": 16, "sulfate": 275, "chloride": 50}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 152, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 67, "duration_days": 8}]
        },
        "notes": {"brewing_notes": "Distinguished from its American counterpart by the bready, biscuity character of Maris Otter malt and the earthy, floral notes of English hops. The water profile is similar to Burton-on-Trent, enhancing the perception of bitterness.", "tasting_notes": "Bready and biscuity malt character with earthy and floral hop notes. A firm bitterness is present."}
    },
    {
        "recipe_id": "AmericanAmberAle_20240805_09",
        "recipe_name": "American Amber Ale",
        "beer_style": {"primary_style": "American Amber Ale", "bjcp_code": "19A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.056, "final_gravity_sg": 1.013, "abv_percent": 5.6, "ibu_tinseth": 35, "srm_morey": 14},
        "ingredients": {
            "fermentables": [
                {"name": "American 2-Row Pale Malt", "weight_lbs": 680, "percentage": 80.0, "type": "Base Malt", "yield_percent": 80.0, "color_lovibond": 1.8},
                {"name": "Munich Malt (10L)", "weight_lbs": 85, "percentage": 10.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 10},
                {"name": "Crystal Malt (60L)", "weight_lbs": 68, "percentage": 8.0, "type": "Specialty Malt", "yield_percent": 74.0, "color_lovibond": 60},
                {"name": "Crystal Malt (120L)", "weight_lbs": 17, "percentage": 2.0, "type": "Specialty Malt", "yield_percent": 72.0, "color_lovibond": 120}
            ],
            "hops": [
                {"name": "Centennial", "alpha_acid_percent": 10.0, "amount_oz": 24, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 25 IBU"},
                {"name": "Cascade", "alpha_acid_percent": 6.0, "amount_oz": 32, "use": "Boil", "time_minutes": 10, "notes": "Aroma: 8 IBU"},
                {"name": "Centennial", "alpha_acid_percent": 10.0, "amount_oz": 32, "use": "Whirlpool", "time_minutes": 20, "temperature_f": 180, "notes": "Aroma: 2 IBU"}
            ],
            "yeast": {"name": "SafAle US-05", "lab": "Fermentis", "strain_code": "US-05", "type": "Ale", "form": "Dry", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 81.0, "flocculation": "Medium", "optimum_temp_f": "59-72"},
            "water_chemistry": {"target_profile_name": "Balanced Amber Profile", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 110, "magnesium": 18, "sodium": 16, "sulfate": 150, "chloride": 75}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 154, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 66, "duration_days": 8}]
        },
        "notes": {"brewing_notes": "A balanced style where caramel malt sweetness supports a firm hop bitterness. The water profile is balanced between sulfate and chloride to prevent either malt or hops from becoming overly dominant.", "tasting_notes": "Caramel malt sweetness balanced by firm hop bitterness and citrusy hop notes."}
    },
    {
        "recipe_id": "EnglishOrdinaryBitter_20240805_10",
        "recipe_name": "English Ordinary Bitter",
        "beer_style": {"primary_style": "Ordinary Bitter", "bjcp_code": "11A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.036, "final_gravity_sg": 1.009, "abv_percent": 3.5, "ibu_tinseth": 30, "srm_morey": 10},
        "ingredients": {
            "fermentables": [
                {"name": "Maris Otter Pale Ale Malt", "weight_lbs": 450, "percentage": 85.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 3},
                {"name": "British Crystal Malt (60L)", "weight_lbs": 79, "percentage": 15.0, "type": "Specialty Malt", "yield_percent": 74.0, "color_lovibond": 60}
            ],
            "hops": [
                {"name": "East Kent Goldings", "alpha_acid_percent": 5.0, "amount_oz": 48, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 27 IBU"},
                {"name": "East Kent Goldings", "alpha_acid_percent": 5.0, "amount_oz": 24, "use": "Boil", "time_minutes": 10, "notes": "Aroma: 3 IBU"}
            ],
            "yeast": {"name": "West Yorkshire Ale", "lab": "Wyeast", "strain_code": "1469", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 75.0, "flocculation": "High", "optimum_temp_f": "64-72"},
            "water_chemistry": {"target_profile_name": "London Water", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 81, "magnesium": 10, "sodium": 41, "sulfate": 105, "chloride": 103}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 154, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 64, "duration_days": 8}]
        },
        "notes": {"brewing_notes": "The quintessential English session ale. Balance is key. The water profile, with its moderate alkalinity and balanced sulfate/chloride, is typical for the style.", "tasting_notes": "A sessionable ale with a good balance of malt and hop character, with restrained esters."}
    },
    {
        "recipe_id": "EnglishBestBitter_20240805_11",
        "recipe_name": "English Best Bitter",
        "beer_style": {"primary_style": "Best Bitter", "bjcp_code": "11B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.044, "final_gravity_sg": 1.011, "abv_percent": 4.3, "ibu_tinseth": 32, "srm_morey": 12},
        "ingredients": {
            "fermentables": [
                {"name": "Maris Otter Pale Ale Malt", "weight_lbs": 550, "percentage": 88.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 3},
                {"name": "British Crystal Malt (80L)", "weight_lbs": 62, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 73.0, "color_lovibond": 80},
                {"name": "British Chocolate Malt", "weight_lbs": 13, "percentage": 2.0, "type": "Specialty Malt", "yield_percent": 60.0, "color_lovibond": 450}
            ],
            "hops": [
                {"name": "Challenger", "alpha_acid_percent": 7.5, "amount_oz": 32, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 25 IBU"},
                {"name": "East Kent Goldings", "alpha_acid_percent": 5.0, "amount_oz": 32, "use": "Boil", "time_minutes": 15, "notes": "Aroma: 7 IBU"}
            ],
            "yeast": {"name": "SafAle S-04", "lab": "Fermentis", "strain_code": "S-04", "type": "Ale", "form": "Dry", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 75.0, "flocculation": "High", "optimum_temp_f": "59-68"},
            "water_chemistry": {"target_profile_name": "Balanced Bitter Profile", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 50, "magnesium": 10, "sodium": 15, "sulfate": 110, "chloride": 50}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 152, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 67, "duration_days": 8}, {"name": "Diacetyl Rest", "temperature_f": 72, "duration_days": 2, "notes": "Allow temperature to free-rise to 72°F (22°C) for a diacetyl rest."}]
        },
        "notes": {"brewing_notes": "A step up in flavor from the Ordinary Bitter. The touch of Chocolate Malt adds color and a subtle roast complexity without being dominant.", "tasting_notes": "More flavor than an Ordinary Bitter, with a subtle roast complexity and a balance between malt and hops."}
    },
    {
        "recipe_id": "EnglishESB_20240805_12",
        "recipe_name": "English ESB (Extra Special Bitter)",
        "beer_style": {"primary_style": "Extra Special Bitter", "bjcp_code": "11C"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.058, "final_gravity_sg": 1.014, "abv_percent": 5.8, "ibu_tinseth": 35, "srm_morey": 13},
        "ingredients": {
            "fermentables": [
                {"name": "Maris Otter Pale Ale Malt", "weight_lbs": 750, "percentage": 90.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 3},
                {"name": "British Crystal Malt (75L)", "weight_lbs": 83, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 74.0, "color_lovibond": 75}
            ],
            "hops": [
                {"name": "Target", "alpha_acid_percent": 10.0, "amount_oz": 16, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 15 IBU"},
                {"name": "Challenger", "alpha_acid_percent": 7.5, "amount_oz": 11.2, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 8 IBU"},
                {"name": "Northdown", "alpha_acid_percent": 8.5, "amount_oz": 11.2, "use": "Boil", "time_minutes": 15, "notes": "Flavor: 4 IBU"},
                {"name": "East Kent Goldings", "alpha_acid_percent": 5.0, "amount_oz": 20.8, "use": "Boil", "time_minutes": 15, "notes": "Flavor: 8 IBU"},
                {"name": "East Kent Goldings", "alpha_acid_percent": 5.0, "amount_oz": 32, "use": "Dry Hop", "time_days": 4, "notes": "Aroma"}
            ],
            "yeast": {"name": "London ESB Ale", "lab": "Wyeast", "strain_code": "1968", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 73.0, "flocculation": "Very High", "optimum_temp_f": "64-72"},
            "water_chemistry": {"target_profile_name": "Hoppy Lite Profile", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 110, "magnesium": 18, "sodium": 16, "sulfate": 100, "chloride": 50}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 153, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 69, "duration_days": 8}]
        },
        "notes": {"brewing_notes": "This recipe is a clone of Fuller's ESB. The complex hop bill and specific yeast strain are crucial for authenticity. The 'Hoppy lite' water profile accentuates the bitterness without the harshness of a high-sulfate American IPA profile.", "tasting_notes": "Complex hop character with fruity esters from the yeast. Balanced bitterness."}
    },
    {
        "recipe_id": "AmericanPorter_20240805_13",
        "recipe_name": "American Porter",
        "beer_style": {"primary_style": "American Porter", "bjcp_code": "20A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.060, "final_gravity_sg": 1.014, "abv_percent": 6.1, "ibu_tinseth": 34, "srm_morey": 36},
        "ingredients": {
            "fermentables": [
                {"name": "American 2-Row Pale Malt", "weight_lbs": 780, "percentage": 80.0, "type": "Base Malt", "yield_percent": 80.0, "color_lovibond": 1.8},
                {"name": "British Crystal Malt (77L)", "weight_lbs": 78, "percentage": 8.0, "type": "Specialty Malt", "yield_percent": 74.0, "color_lovibond": 77},
                {"name": "British Chocolate Malt", "weight_lbs": 73, "percentage": 8.0, "type": "Specialty Malt", "yield_percent": 60.0, "color_lovibond": 450},
                {"name": "British Roasted Barley", "weight_lbs": 44, "percentage": 4.0, "type": "Specialty Malt", "yield_percent": 55.0, "color_lovibond": 500}
            ],
            "hops": [
                {"name": "Fuggles", "alpha_acid_percent": 4.5, "amount_oz": 24, "use": "First Wort", "time_minutes": 60, "notes": "Bitterness: 13 IBU"},
                {"name": "Amarillo", "alpha_acid_percent": 8.6, "amount_oz": 32, "use": "Boil", "time_minutes": 10, "notes": "Flavor: 11 IBU"},
                {"name": "Styrian Goldings", "alpha_acid_percent": 4.5, "amount_oz": 40, "use": "Boil", "time_minutes": 5, "notes": "Aroma: 10 IBU"},
                {"name": "Styrian Goldings", "alpha_acid_percent": 4.5, "amount_oz": 40, "use": "Dry Hop", "time_days": 3, "notes": "Optional Aroma"}
            ],
            "yeast": {"name": "California Ale Yeast", "lab": "White Labs", "strain_code": "WLP001", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.0, "attenuation_percent": 80.0, "flocculation": "Medium", "optimum_temp_f": "68-73"},
            "water_chemistry": {"target_profile_name": "Deschutes Black Butte Porter-like", "starting_water_ph": 7.0, "mash_ph": 5.5, "ions_ppm": {"calcium": 129, "magnesium": 10, "sodium": 16, "sulfate": 136, "chloride": 89}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 154, "duration_minutes": 60, "type": "Infusion", "notes": "Add dark grains during the vorlauf (recirculation) step to minimize harshness."}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 64, "duration_days": 12}]
        },
        "notes": {"brewing_notes": "This recipe, inspired by Gordon Strong's American Porter, uses a water profile similar to Deschutes Black Butte Porter to enhance body. Adding dark grains late in the mash is a commercial technique to extract color and flavor while reducing astringency.", "tasting_notes": "A robust porter with significant roast, chocolate, and caramel flavors, balanced by American hop character."}
    },
    {
        "recipe_id": "EnglishPorter_20240805_14",
        "recipe_name": "English Porter",
        "beer_style": {"primary_style": "English Porter", "bjcp_code": "13C"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.050, "final_gravity_sg": 1.012, "abv_percent": 5.0, "ibu_tinseth": 30, "srm_morey": 28},
        "ingredients": {
            "fermentables": [
                {"name": "Maris Otter Pale Ale Malt", "weight_lbs": 600, "percentage": 82.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 3},
                {"name": "British Brown Malt", "weight_lbs": 73, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 70.0, "color_lovibond": 65},
                {"name": "British Crystal Malt (80L)", "weight_lbs": 37, "percentage": 5.0, "type": "Specialty Malt", "yield_percent": 73.0, "color_lovibond": 80},
                {"name": "British Chocolate Malt", "weight_lbs": 22, "percentage": 3.0, "type": "Specialty Malt", "yield_percent": 60.0, "color_lovibond": 450}
            ],
            "hops": [
                {"name": "Fuggle", "alpha_acid_percent": 4.5, "amount_oz": 40, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 22 IBU"},
                {"name": "East Kent Goldings", "alpha_acid_percent": 5.0, "amount_oz": 32, "use": "Boil", "time_minutes": 15, "notes": "Aroma: 8 IBU"}
            ],
            "yeast": {"name": "English Ale Yeast", "lab": "White Labs", "strain_code": "WLP002", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 70.0, "flocculation": "High", "optimum_temp_f": "65-70"},
            "water_chemistry": {"target_profile_name": "London Porter Profile", "starting_water_ph": 7.0, "mash_ph": 5.5, "ions_ppm": {"calcium": 50, "magnesium": 10, "sodium": 33, "sulfate": 35, "chloride": 45}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 154, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 66, "duration_days": 12}]
        },
        "notes": {"brewing_notes": "Softer and more malt-focused than its American counterpart. Brown malt is a key historical ingredient, providing a nutty, coffee-like character. The water profile has moderate alkalinity to buffer the acidity of the dark malts.", "tasting_notes": "A soft, malt-focused porter with nutty, coffee-like character and restrained hop presence."}
    },
    {
        "recipe_id": "AmericanStout_20240805_15",
        "recipe_name": "American Stout",
        "beer_style": {"primary_style": "American Stout", "bjcp_code": "20B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.065, "final_gravity_sg": 1.015, "abv_percent": 6.6, "ibu_tinseth": 50, "srm_morey": 40},
        "ingredients": {
            "fermentables": [
                {"name": "American 2-Row Pale Malt", "weight_lbs": 850, "percentage": 80.0, "type": "Base Malt", "yield_percent": 80.0, "color_lovibond": 1.8},
                {"name": "Roasted Barley", "weight_lbs": 85, "percentage": 8.0, "type": "Specialty Malt", "yield_percent": 55.0, "color_lovibond": 500},
                {"name": "Chocolate Malt", "weight_lbs": 85, "percentage": 8.0, "type": "Specialty Malt", "yield_percent": 60.0, "color_lovibond": 350},
                {"name": "Crystal Malt (120L)", "weight_lbs": 42, "percentage": 4.0, "type": "Specialty Malt", "yield_percent": 72.0, "color_lovibond": 120}
            ],
            "hops": [
                {"name": "Columbus", "alpha_acid_percent": 15.0, "amount_oz": 64, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 45 IBU"},
                {"name": "Cascade", "alpha_acid_percent": 6.0, "amount_oz": 32, "use": "Boil", "time_minutes": 10, "notes": "Aroma: 5 IBU"}
            ],
            "yeast": {"name": "California Ale Yeast", "lab": "White Labs", "strain_code": "WLP001", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.0, "attenuation_percent": 80.0, "flocculation": "Medium", "optimum_temp_f": "68-73"},
            "water_chemistry": {"target_profile_name": "Roasty Stout Profile", "starting_water_ph": 7.0, "mash_ph": 5.5, "ions_ppm": {"calcium": 100, "magnesium": 15, "sodium": 20, "sulfate": 100, "chloride": 75}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 154, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 67, "duration_days": 12}]
        },
        "notes": {"brewing_notes": "Defined by a prominent roast character balanced by American hops. The water profile includes moderate alkalinity to buffer the acidic dark malts.", "tasting_notes": "Prominent roast character from malt, balanced by classic American hop bitterness and aroma."}
    },
    {
        "recipe_id": "OatmealStout_20240805_16",
        "recipe_name": "Oatmeal Stout",
        "beer_style": {"primary_style": "Oatmeal Stout", "bjcp_code": "16B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.054, "final_gravity_sg": 1.018, "abv_percent": 4.7, "ibu_tinseth": 30, "srm_morey": 35},
        "ingredients": {
            "fermentables": [
                {"name": "Maris Otter Pale Ale Malt", "weight_lbs": 600, "percentage": 75.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 3},
                {"name": "Flaked Oats", "weight_lbs": 120, "percentage": 15.0, "type": "Adjunct", "yield_percent": 70.0, "color_lovibond": 1},
                {"name": "Roasted Barley", "weight_lbs": 40, "percentage": 5.0, "type": "Specialty Malt", "yield_percent": 55.0, "color_lovibond": 500},
                {"name": "British Crystal Malt (80L)", "weight_lbs": 40, "percentage": 5.0, "type": "Specialty Malt", "yield_percent": 73.0, "color_lovibond": 80}
            ],
            "hops": [
                {"name": "East Kent Goldings", "alpha_acid_percent": 5.0, "amount_oz": 48, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 30 IBU"}
            ],
            "yeast": {"name": "Irish Ale Yeast", "lab": "Wyeast", "strain_code": "1084", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 73.0, "flocculation": "Medium", "optimum_temp_f": "62-72"},
            "water_chemistry": {"target_profile_name": "Soft Stout Profile", "starting_water_ph": 7.0, "mash_ph": 5.5, "ions_ppm": {"calcium": 52, "magnesium": 0, "sodium": 15, "sulfate": 45, "chloride": 50}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 154, "duration_minutes": 60, "type": "Infusion", "notes": "Rice hulls (approx. 5% of grist weight) are recommended to prevent a stuck sparge."}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 64, "duration_days": 8, "notes": "Raise to 72°F (22°C) after the first 3-5 days to ensure full attenuation."}]
        },
        "notes": {"brewing_notes": "The flaked oats provide a silky, smooth mouthfeel and full body. The mash pH should be carefully managed to avoid extracting astringency from the dark grains while preserving body.", "tasting_notes": "A silky, smooth mouthfeel with a full body and notes of coffee and chocolate."}
    },
    {
        "recipe_id": "IrishStout_20240805_17",
        "recipe_name": "Irish Stout (Guinness Clone)",
        "beer_style": {"primary_style": "Irish Stout", "bjcp_code": "15B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.042, "final_gravity_sg": 1.010, "abv_percent": 4.2, "ibu_tinseth": 40, "srm_morey": 40},
        "ingredients": {
            "fermentables": [
                {"name": "Maris Otter Pale Ale Malt", "weight_lbs": 420, "percentage": 70.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 3},
                {"name": "Flaked Barley", "weight_lbs": 120, "percentage": 20.0, "type": "Adjunct", "yield_percent": 70.0, "color_lovibond": 1.5},
                {"name": "Roasted Barley", "weight_lbs": 60, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 55.0, "color_lovibond": 500}
            ],
            "hops": [
                {"name": "East Kent Goldings", "alpha_acid_percent": 5.0, "amount_oz": 72, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 40 IBU"}
            ],
            "yeast": {"name": "Irish Ale", "lab": "Wyeast", "strain_code": "1084", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 73.0, "flocculation": "Medium", "optimum_temp_f": "62-72"},
            "water_chemistry": {"target_profile_name": "Dublin Water", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 110, "magnesium": 4, "sodium": 12, "sulfate": 53, "chloride": 19}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 150, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 68, "duration_days": 8}]
        },
        "notes": {"brewing_notes": "The defining characteristics are the sharp, coffee-like flavor from roasted barley and the creamy head, traditionally enhanced by nitrogen gas dispense. The high bicarbonate water profile is characteristic of Dublin and helps balance the acidity of the roasted barley. A small amount of soured beer or lactic acid is sometimes added to replicate a traditional 'Guinness tang'.", "tasting_notes": "Sharp, coffee-like flavor from roasted barley with a creamy head."}
    },
    {
        "recipe_id": "SweetStout_20240805_18",
        "recipe_name": "Sweet (Milk) Stout",
        "beer_style": {"primary_style": "Sweet Stout", "bjcp_code": "16A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.060, "final_gravity_sg": 1.022, "abv_percent": 5.0, "ibu_tinseth": 25, "srm_morey": 38},
        "ingredients": {
            "fermentables": [
                {"name": "Maris Otter Pale Ale Malt", "weight_lbs": 650, "percentage": 75.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 3},
                {"name": "British Crystal Malt (80L)", "weight_lbs": 87, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 73.0, "color_lovibond": 80},
                {"name": "Roasted Barley", "weight_lbs": 43, "percentage": 5.0, "type": "Specialty Malt", "yield_percent": 55.0, "color_lovibond": 500},
                {"name": "Lactose (Milk Sugar)", "weight_lbs": 87, "percentage": 10.0, "type": "Sugar", "yield_percent": 100.0, "color_lovibond": 0}
            ],
            "hops": [
                {"name": "Fuggle", "alpha_acid_percent": 4.5, "amount_oz": 32, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 25 IBU"}
            ],
            "yeast": {"name": "English Ale Yeast", "lab": "White Labs", "strain_code": "WLP002", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 70.0, "flocculation": "High", "optimum_temp_f": "65-70"},
            "water_chemistry": {"target_profile_name": "Sweet Stout Profile", "starting_water_ph": 7.0, "mash_ph": 5.6, "ions_ppm": {"calcium": 97, "magnesium": 2, "sodium": 51, "sulfate": 83, "chloride": 82}, "additions": []},
            "other_ingredients": [{"name": "Lactose (Milk Sugar)", "amount_lbs": 87, "use": "Kettle"}]
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 156, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 68, "duration_days": 12}]
        },
        "notes": {"brewing_notes": "Lactose is an unfermentable sugar, which remains in the final beer to provide sweetness and a full, creamy body. It is added late in the boil. The higher mash temperature also contributes to a fuller body.", "tasting_notes": "Sweet and full-bodied with a creamy texture and notes of chocolate and coffee."}
    },
    {
        "recipe_id": "Witbier_20240805_19",
        "recipe_name": "Witbier",
        "beer_style": {"primary_style": "Witbier", "bjcp_code": "24A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.048, "final_gravity_sg": 1.010, "abv_percent": 5.0, "ibu_tinseth": 15, "srm_morey": 3},
        "ingredients": {
            "fermentables": [
                {"name": "Belgian Pilsner Malt", "weight_lbs": 330, "percentage": 50.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5},
                {"name": "Unmalted White Wheat", "weight_lbs": 264, "percentage": 40.0, "type": "Adjunct", "yield_percent": 75.0, "color_lovibond": 2},
                {"name": "Flaked Oats", "weight_lbs": 66, "percentage": 10.0, "type": "Adjunct", "yield_percent": 70.0, "color_lovibond": 1}
            ],
            "hops": [
                {"name": "Crystal", "alpha_acid_percent": 3.5, "amount_oz": 16, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 10 IBU"},
                {"name": "Saaz", "alpha_acid_percent": 3.5, "amount_oz": 16, "use": "Boil", "time_minutes": 10, "notes": "Aroma: 5 IBU"}
            ],
            "yeast": {"name": "Belgian Witbier", "lab": "Wyeast", "strain_code": "3944", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 75.0, "flocculation": "Low", "optimum_temp_f": "62-75"},
            "water_chemistry": {"target_profile_name": "Balanced Belgian Profile", "starting_water_ph": 7.0, "mash_ph": 5.3, "ions_ppm": {"calcium": 50, "magnesium": 10, "sodium": 16, "sulfate": 70, "chloride": 70}, "additions": []},
            "other_ingredients": [
                {"name": "Crushed Coriander", "amount_lbs": 1.5, "use": "Whirlpool"},
                {"name": "Bitter Orange Peel", "amount_lbs": 1.0, "use": "Whirlpool"}
            ]
        },
        "process": {
            "mash_schedule": [
                {"name": "Protein rest", "temperature_f": 122, "duration_minutes": 15, "type": "Step"},
                {"name": "Saccharification rest", "temperature_f": 152, "duration_minutes": 60, "type": "Step"}
            ],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 68, "duration_days": 8, "notes": "Allow to free-rise to 74°F (23°C) to encourage ester and phenol production."}]
        },
        "notes": {"brewing_notes": "A refreshing, spicy, and citrusy wheat beer. The unmalted wheat and oats contribute to the characteristic haze and silky mouthfeel. Spices are added post-boil to preserve their delicate aromas. Rice hulls are highly recommended.", "tasting_notes": "Refreshing, spicy, and citrusy with a characteristic haze and silky mouthfeel."}
    },
    {
        "recipe_id": "Saison_20240805_20",
        "recipe_name": "Saison",
        "beer_style": {"primary_style": "Saison", "bjcp_code": "25B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.054, "final_gravity_sg": 1.004, "abv_percent": 6.6, "ibu_tinseth": 25, "srm_morey": 4},
        "ingredients": {
            "fermentables": [
                {"name": "Belgian Pilsner Malt", "weight_lbs": 600, "percentage": 80.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5},
                {"name": "Vienna Malt", "weight_lbs": 75, "percentage": 10.0, "type": "Base Malt", "yield_percent": 79.0, "color_lovibond": 3.5},
                {"name": "White Wheat Malt", "weight_lbs": 75, "percentage": 10.0, "type": "Base Malt", "yield_percent": 84.0, "color_lovibond": 2}
            ],
            "hops": [
                {"name": "Styrian Goldings", "alpha_acid_percent": 5.0, "amount_oz": 32, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 20 IBU"},
                {"name": "Saaz", "alpha_acid_percent": 3.5, "amount_oz": 32, "use": "Boil", "time_minutes": 10, "notes": "Aroma: 5 IBU"}
            ],
            "yeast": {"name": "Belgian Saison", "lab": "Wyeast", "strain_code": "3724", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 85.0, "flocculation": "Low", "optimum_temp_f": "70-95"},
            "water_chemistry": {"target_profile_name": "Dry Saison Profile", "starting_water_ph": 7.0, "mash_ph": 5.2, "ions_ppm": {"calcium": 100, "magnesium": 10, "sodium": 35, "sulfate": 107, "chloride": 100}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 148, "duration_minutes": 90, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 70, "duration_days": 10, "notes": "Let free-rise into the low 80s°F (27-28°C)."}]
        },
        "notes": {"brewing_notes": "Saisons are defined by their yeast character: peppery phenols, fruity esters, and a very dry finish. Many Saison strains are Saccharomyces cerevisiae var. diastaticus and require careful handling and sanitation to prevent cross-contamination of other beers.", "tasting_notes": "Peppery phenols, fruity esters, and a very dry finish."}
    },
    {
        "recipe_id": "BelgianBlondAle_20240805_21",
        "recipe_name": "Belgian Blond Ale",
        "beer_style": {"primary_style": "Belgian Blond Ale", "bjcp_code": "25A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.065, "final_gravity_sg": 1.010, "abv_percent": 7.2, "ibu_tinseth": 22, "srm_morey": 6},
        "ingredients": {
            "fermentables": [
                {"name": "Belgian Pilsner Malt", "weight_lbs": 800, "percentage": 90.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5},
                {"name": "Cane Sugar", "weight_lbs": 89, "percentage": 10.0, "type": "Sugar", "yield_percent": 100.0, "color_lovibond": 0}
            ],
            "hops": [
                {"name": "Styrian Goldings", "alpha_acid_percent": 5.0, "amount_oz": 32, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 18 IBU"},
                {"name": "Saaz", "alpha_acid_percent": 3.5, "amount_oz": 24, "use": "Boil", "time_minutes": 15, "notes": "Aroma: 4 IBU"}
            ],
            "yeast": {"name": "Belgian Abbey Ale", "lab": "Wyeast", "strain_code": "1214", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.0, "attenuation_percent": 76.0, "flocculation": "Medium", "optimum_temp_f": "68-78"},
            "water_chemistry": {"target_profile_name": "Balanced Belgian Profile", "starting_water_ph": 7.0, "mash_ph": 5.3, "ions_ppm": {"calcium": 50, "magnesium": 10, "sodium": 16, "sulfate": 70, "chloride": 70}, "additions": []},
            "other_ingredients": [{"name": "Cane Sugar", "amount_lbs": 89, "use": "Kettle"}]
        },
        "process": {
            "mash_schedule": [
                {"name": "Step 1", "temperature_f": 145, "duration_minutes": 60, "type": "Step"},
                {"name": "Step 2", "temperature_f": 162, "duration_minutes": 20, "type": "Step"}
            ],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 64, "duration_days": 6, "notes": "Allow to free-rise to 72°F (22°C) over 5-7 days."}]
        },
        "notes": {"brewing_notes": "A moderately strong ale with subtle Belgian yeast complexity. The sugar addition lightens the body and boosts the alcohol content, contributing to a deceptively drinkable beer.", "tasting_notes": "Subtle Belgian yeast complexity with a light body and a deceptively drinkable character."}
    },
    {
        "recipe_id": "BelgianDubbel_20240805_22",
        "recipe_name": "Belgian Dubbel",
        "beer_style": {"primary_style": "Belgian Dubbel", "bjcp_code": "26B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.068, "final_gravity_sg": 1.012, "abv_percent": 7.4, "ibu_tinseth": 25, "srm_morey": 18},
        "ingredients": {
            "fermentables": [
                {"name": "Belgian Pilsner Malt", "weight_lbs": 750, "percentage": 80.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5},
                {"name": "Aromatic Malt", "weight_lbs": 94, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 78.0, "color_lovibond": 20},
                {"name": "Dark Candi Syrup (D-90)", "weight_lbs": 94, "percentage": 10.0, "type": "Sugar", "yield_percent": 100.0, "color_lovibond": 90}
            ],
            "hops": [
                {"name": "Styrian Goldings", "alpha_acid_percent": 5.0, "amount_oz": 40, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 25 IBU"}
            ],
            "yeast": {"name": "Trappist High Gravity", "lab": "Wyeast", "strain_code": "3787", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.0, "attenuation_percent": 80.0, "flocculation": "Medium", "optimum_temp_f": "64-78"},
            "water_chemistry": {"target_profile_name": "Soft Belgian Profile", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 41, "magnesium": 8, "sodium": 16, "sulfate": 26, "chloride": 60}, "additions": []},
            "other_ingredients": [{"name": "Dark Candi Syrup (D-90)", "amount_lbs": 94, "use": "Kettle"}]
        },
        "process": {
            "mash_schedule": [
                {"name": "Step 1", "temperature_f": 149, "duration_minutes": 60, "type": "Step"},
                {"name": "Step 2", "temperature_f": 162, "duration_minutes": 15, "type": "Step"}
            ],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 66, "duration_days": 8, "notes": "Allow to free-rise to 72°F (22°C) over the course of fermentation."}]
        },
        "notes": {"brewing_notes": "Characterized by dark fruit esters (raisin, plum) and spicy phenols. The dark candi syrup is essential for the authentic color and flavor profile.", "tasting_notes": "Dark fruit esters (raisin, plum) and spicy phenols with a rich malt body."}
    },
    {
        "recipe_id": "BelgianTripel_20240805_23",
        "recipe_name": "Belgian Tripel (Westmalle Clone)",
        "beer_style": {"primary_style": "Belgian Tripel", "bjcp_code": "26C"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.080, "final_gravity_sg": 1.010, "abv_percent": 9.2, "ibu_tinseth": 38, "srm_morey": 6},
        "ingredients": {
            "fermentables": [
                {"name": "Belgian Pilsner Malt", "weight_lbs": 1000, "percentage": 85.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5},
                {"name": "Clear Candi Sugar / Sucrose", "weight_lbs": 176, "percentage": 15.0, "type": "Sugar", "yield_percent": 100.0, "color_lovibond": 0}
            ],
            "hops": [
                {"name": "Styrian Goldings", "alpha_acid_percent": 5.0, "amount_oz": 64, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 32 IBU"},
                {"name": "Tettnanger", "alpha_acid_percent": 4.5, "amount_oz": 32, "use": "Boil", "time_minutes": 15, "notes": "Aroma: 6 IBU"}
            ],
            "yeast": {"name": "Trappist High Gravity", "lab": "Wyeast", "strain_code": "3787", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.25, "attenuation_percent": 80.0, "flocculation": "Medium", "optimum_temp_f": "64-78"},
            "water_chemistry": {"target_profile_name": "Balanced Belgian Profile", "starting_water_ph": 7.0, "mash_ph": 5.2, "ions_ppm": {"calcium": 50, "magnesium": 10, "sodium": 16, "sulfate": 70, "chloride": 70}, "additions": []},
            "other_ingredients": [{"name": "Clear Candi Sugar / Sucrose", "amount_lbs": 176, "use": "Kettle"}]
        },
        "process": {
            "mash_schedule": [
                {"name": "Protein rest", "temperature_f": 131, "duration_minutes": 15, "type": "Step"},
                {"name": "Saccharification rest", "temperature_f": 149, "duration_minutes": 90, "type": "Step"}
            ],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 64, "duration_days": 7, "notes": "Allow the temperature to slowly rise to 70°F (21°C) over one week."}]
        },
        "notes": {"brewing_notes": "A strong, pale, and complex ale. The low mash temperature and sugar addition ensure a very dry finish, which is characteristic of the style. High carbonation is essential.", "tasting_notes": "A strong, pale, and complex ale with a very dry finish and high carbonation."}
    },
    {
        "recipe_id": "BelgianDarkStrongAle_20240805_24",
        "recipe_name": "Belgian Dark Strong Ale (Quadrupel)",
        "beer_style": {"primary_style": "Belgian Dark Strong Ale", "bjcp_code": "26D"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.095, "final_gravity_sg": 1.018, "abv_percent": 10.1, "ibu_tinseth": 28, "srm_morey": 22},
        "ingredients": {
            "fermentables": [
                {"name": "Belgian Pilsner Malt", "weight_lbs": 1000, "percentage": 75.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5},
                {"name": "Aromatic Malt", "weight_lbs": 133, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 78.0, "color_lovibond": 20},
                {"name": "Dark Candi Syrup (D-180)", "weight_lbs": 200, "percentage": 15.0, "type": "Sugar", "yield_percent": 100.0, "color_lovibond": 180}
            ],
            "hops": [
                {"name": "Styrian Goldings", "alpha_acid_percent": 5.0, "amount_oz": 40, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 25 IBU"},
                {"name": "Saaz", "alpha_acid_percent": 3.5, "amount_oz": 24, "use": "Boil", "time_minutes": 10, "notes": "Aroma: 3 IBU"}
            ],
            "yeast": {"name": "Trappist High Gravity", "lab": "Wyeast", "strain_code": "3787", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.5, "attenuation_percent": 80.0, "flocculation": "Medium", "optimum_temp_f": "64-78"},
            "water_chemistry": {"target_profile_name": "Balanced Belgian Profile", "starting_water_ph": 7.0, "mash_ph": 5.3, "ions_ppm": {"calcium": 74, "magnesium": 7, "sodium": 8, "sulfate": 75, "chloride": 100}, "additions": []},
            "other_ingredients": [{"name": "Dark Candi Syrup (D-180)", "amount_lbs": 200, "use": "Kettle"}]
        },
        "process": {
            "mash_schedule": [
                {"name": "Step 1", "temperature_f": 144, "duration_minutes": 45, "type": "Step"},
                {"name": "Step 2", "temperature_f": 158, "duration_minutes": 15, "type": "Step"}
            ],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 68, "duration_days": 13, "notes": "Pitch at 68°F (20°C) for 3 days, then allow to free-rise to 75°F (24°C) for 10 days."}]
        },
        "notes": {"brewing_notes": "The pinnacle of Belgian abbey ales. Rich, complex, and malty with deep notes of dark fruit, caramel, and spice. The dark candi syrup is non-negotiable for achieving the correct flavor profile.", "tasting_notes": "Rich, complex, and malty with deep notes of dark fruit, caramel, and spice."}
    },
    {
        "recipe_id": "Altbier_20240805_25",
        "recipe_name": "Altbier",
        "beer_style": {"primary_style": "Altbier", "bjcp_code": "7B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.048, "final_gravity_sg": 1.011, "abv_percent": 4.9, "ibu_tinseth": 40, "srm_morey": 15},
        "ingredients": {
            "fermentables": [
                {"name": "German Pilsner Malt", "weight_lbs": 400, "percentage": 55.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5},
                {"name": "German Munich Malt", "weight_lbs": 218, "percentage": 30.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 10},
                {"name": "Caramunich Malt", "weight_lbs": 73, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 71.0, "color_lovibond": 56},
                {"name": "Carafa Special II (Dehusked)", "weight_lbs": 36, "percentage": 5.0, "type": "Specialty Malt", "yield_percent": 70.0, "color_lovibond": 415}
            ],
            "hops": [
                {"name": "Spalt", "alpha_acid_percent": 5.0, "amount_oz": 48, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 32 IBU"},
                {"name": "Spalt", "alpha_acid_percent": 5.0, "amount_oz": 32, "use": "Boil", "time_minutes": 15, "notes": "Aroma: 8 IBU"}
            ],
            "yeast": {"name": "German Ale", "lab": "Wyeast", "strain_code": "1007", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.0, "attenuation_percent": 75.0, "flocculation": "Low", "optimum_temp_f": "55-68"},
            "water_chemistry": {"target_profile_name": "Düsseldorf Water", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 90, "magnesium": 12, "sodium": 45, "sulfate": 65, "chloride": 82}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [
                {"name": "Step 1", "temperature_f": 145, "duration_minutes": 45, "type": "Step"},
                {"name": "Step 2", "temperature_f": 162, "duration_minutes": 20, "type": "Step"}
            ],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [
                {"name": "Primary Fermentation", "temperature_f": 62, "duration_days": 10},
                {"name": "Lager", "temperature_f": 34, "duration_days": 28}
            ]
        },
        "notes": {"brewing_notes": "A German 'old' ale, fermented cool with an ale yeast and then lagered. This process results in a very clean, crisp, malt-forward beer with a firm hop bitterness. The Düsseldorf water profile is key to its authentic character.", "tasting_notes": "A clean, crisp, malt-forward beer with a firm hop bitterness."}
    },
    {
        "recipe_id": "Hefeweizen_20240805_26",
        "recipe_name": "Hefeweizen",
        "beer_style": {"primary_style": "Hefeweizen", "bjcp_code": "10A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.050, "final_gravity_sg": 1.012, "abv_percent": 5.0, "ibu_tinseth": 12, "srm_morey": 4},
        "ingredients": {
            "fermentables": [
                {"name": "German Wheat Malt", "weight_lbs": 400, "percentage": 60.0, "type": "Base Malt", "yield_percent": 85.0, "color_lovibond": 2},
                {"name": "German Pilsner Malt", "weight_lbs": 267, "percentage": 40.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5}
            ],
            "hops": [
                {"name": "Hallertau Mittelfrüh", "alpha_acid_percent": 4.0, "amount_oz": 16, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 12 IBU"}
            ],
            "yeast": {"name": "Weihenstephan Weizen", "lab": "Wyeast", "strain_code": "3068", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 75.0, "flocculation": "Low", "optimum_temp_f": "64-75"},
            "water_chemistry": {"target_profile_name": "Balanced German Profile", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 50, "magnesium": 10, "sodium": 16, "sulfate": 70, "chloride": 70}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [
                {"name": "Ferulic acid rest", "temperature_f": 110, "duration_minutes": 20, "type": "Step"},
                {"name": "Saccharification rest", "temperature_f": 152, "duration_minutes": 60, "type": "Step"}
            ],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 64, "duration_days": 8}]
        },
        "notes": {"brewing_notes": "The ferulic acid rest is crucial for producing 4-vinyl guaiacol, the compound responsible for the signature clove flavor. Fermentation temperature can be manipulated to favor banana (warmer) or clove (cooler) character.", "tasting_notes": "A balance of banana esters and clove phenols."}
    },
    {
        "recipe_id": "Dunkelweizen_20240805_27",
        "recipe_name": "Dunkelweizen",
        "beer_style": {"primary_style": "Dunkelweizen", "bjcp_code": "10B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.052, "final_gravity_sg": 1.013, "abv_percent": 5.1, "ibu_tinseth": 15, "srm_morey": 18},
        "ingredients": {
            "fermentables": [
                {"name": "German Wheat Malt", "weight_lbs": 400, "percentage": 55.0, "type": "Base Malt", "yield_percent": 85.0, "color_lovibond": 2},
                {"name": "German Munich Malt (10L)", "weight_lbs": 255, "percentage": 35.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 10},
                {"name": "Carafa Special II (Dehusked)", "weight_lbs": 73, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 70.0, "color_lovibond": 415}
            ],
            "hops": [
                {"name": "Hallertau Mittelfrüh", "alpha_acid_percent": 4.0, "amount_oz": 19.2, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 15 IBU"}
            ],
            "yeast": {"name": "Weihenstephan Weizen", "lab": "Wyeast", "strain_code": "3068", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 75.0, "flocculation": "Low", "optimum_temp_f": "64-75"},
            "water_chemistry": {"target_profile_name": "Munich Water", "starting_water_ph": 7.0, "mash_ph": 5.5, "ions_ppm": {"calcium": 82, "magnesium": 20, "sodium": 4, "sulfate": 16, "chloride": 2}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 154, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [
                {"name": "Primary Fermentation", "temperature_f": 64, "duration_days": 8},
                {"name": "Secondary Fermentation", "temperature_f": 32, "duration_days": 14}
            ]
        },
        "notes": {"brewing_notes": "A darker version of a hefeweizen, with rich malt flavors of bread crust and caramel complementing the yeast-driven banana and clove. The Munich water profile provides the necessary alkalinity.", "tasting_notes": "Rich malt flavors of bread crust and caramel with notes of banana and clove."}
    },
    {
        "recipe_id": "Weizenbock_20240805_28",
        "recipe_name": "Weizenbock",
        "beer_style": {"primary_style": "Weizenbock", "bjcp_code": "10C"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.072, "final_gravity_sg": 1.018, "abv_percent": 7.1, "ibu_tinseth": 20, "srm_morey": 15},
        "ingredients": {
            "fermentables": [
                {"name": "German Wheat Malt", "weight_lbs": 550, "percentage": 55.0, "type": "Base Malt", "yield_percent": 85.0, "color_lovibond": 2},
                {"name": "German Munich Malt (10L)", "weight_lbs": 350, "percentage": 35.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 10},
                {"name": "German Pilsner Malt", "weight_lbs": 100, "percentage": 10.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5}
            ],
            "hops": [
                {"name": "Hallertau Mittelfrüh", "alpha_acid_percent": 4.0, "amount_oz": 28, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 20 IBU"}
            ],
            "yeast": {"name": "Weihenstephan Weizen", "lab": "Wyeast", "strain_code": "3068", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.0, "attenuation_percent": 75.0, "flocculation": "Low", "optimum_temp_f": "64-75"},
            "water_chemistry": {"target_profile_name": "Balanced German Profile", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 50, "magnesium": 10, "sodium": 16, "sulfate": 70, "chloride": 70}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 152, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 62, "duration_days": 14}]
        },
        "notes": {"brewing_notes": "A strong, malty wheat beer that combines the characters of a bock and a hefeweizen. The rich Munich malt provides a bready depth that supports the classic weizen yeast profile.", "tasting_notes": "A strong, malty wheat beer with a bready depth and classic weizen yeast profile (banana and clove)."}
    },
    {
        "recipe_id": "AmericanLager_20240805_29",
        "recipe_name": "American Lager",
        "beer_style": {"primary_style": "American Lager", "bjcp_code": "1B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.045, "final_gravity_sg": 1.008, "abv_percent": 4.9, "ibu_tinseth": 12, "srm_morey": 3},
        "ingredients": {
            "fermentables": [
                {"name": "American 6-Row Malt", "weight_lbs": 420, "percentage": 70.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 1.8},
                {"name": "Flaked Rice", "weight_lbs": 180, "percentage": 30.0, "type": "Adjunct", "yield_percent": 80.0, "color_lovibond": 0.5}
            ],
            "hops": [
                {"name": "Hallertau Mittelfrüh", "alpha_acid_percent": 4.0, "amount_oz": 16, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 12 IBU"}
            ],
            "yeast": {"name": "American Lager Yeast", "lab": "White Labs", "strain_code": "WLP840", "type": "Lager", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.5, "attenuation_percent": 77.0, "flocculation": "Medium", "optimum_temp_f": "50-55"},
            "water_chemistry": {"target_profile_name": "Light Lager Profile", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 50, "magnesium": 0, "sodium": 5, "sulfate": 75, "chloride": 60}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Cereal mash", "temperature_f": 150, "duration_minutes": 60, "type": "Decoction", "notes": "Cereal mash required for the flaked rice. Mash main grist (6-Row) at 150°F (66°C). Cook rice separately with a portion of the malted barley, then add to the main mash to raise temperature for saccharification."}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [
                {"name": "Primary Fermentation", "temperature_f": 50, "duration_days": 7},
                {"name": "Diacetyl rest", "temperature_f": 55, "duration_days": 3},
                {"name": "Lager", "temperature_f": 34, "duration_days": 24}
            ]
        },
        "notes": {"brewing_notes": "A very light and crisp lager defined by its high adjunct percentage. The soft water profile is critical. The goal is a clean, refreshing beer with minimal character.", "tasting_notes": "A very light, crisp, and clean lager with minimal character."}
    },
    {
        "recipe_id": "GermanPilsner_20240805_30",
        "recipe_name": "German Pilsner",
        "beer_style": {"primary_style": "German Pilsner", "bjcp_code": "5D"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 555, "post_boil_gallons": 488, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.048, "final_gravity_sg": 1.010, "abv_percent": 5.0, "ibu_tinseth": 35, "srm_morey": 3},
        "ingredients": {
            "fermentables": [
                {"name": "German Pilsner Malt", "weight_lbs": 650, "percentage": 100.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5}
            ],
            "hops": [
                {"name": "Magnum", "alpha_acid_percent": 14.0, "amount_oz": 32, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 25 IBU"},
                {"name": "Hallertau Mittelfrüh", "alpha_acid_percent": 4.0, "amount_oz": 32, "use": "Boil", "time_minutes": 15, "notes": "Flavor: 6 IBU"},
                {"name": "Tettnanger", "alpha_acid_percent": 4.5, "amount_oz": 40, "use": "Boil", "time_minutes": 5, "notes": "Aroma: 4 IBU"}
            ],
            "yeast": {"name": "Saflager W-34/70", "lab": "Fermentis", "strain_code": "W-34/70", "type": "Lager", "form": "Dry", "pitch_rate_million_cells_per_ml": 1.5, "attenuation_percent": 83.0, "flocculation": "High", "optimum_temp_f": "53-59"},
            "water_chemistry": {"target_profile_name": "Pilsen Water", "starting_water_ph": 7.0, "mash_ph": 5.3, "ions_ppm": {"calcium": 60, "magnesium": 8, "sodium": 16, "sulfate": 93, "chloride": 63}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [
                {"name": "Step 1", "temperature_f": 144, "duration_minutes": 40, "type": "Step"},
                {"name": "Step 2", "temperature_f": 160, "duration_minutes": 40, "type": "Step"}
            ],
            "boil_duration_minutes": 90,
            "fermentation_schedule": [
                {"name": "Primary Fermentation", "temperature_f": 50, "duration_days": 14},
                {"name": "Diacetyl rest", "temperature_f": 60, "duration_days": 3},
                {"name": "Lager", "temperature_f": 35, "duration_days": 35}
            ]
        },
        "notes": {"brewing_notes": "A crisp, bitter lager showcasing noble hops. The water profile is moderately high in sulfates to accentuate the sharp, clean bitterness. A 90-minute boil is often recommended to drive off DMS precursors from the Pilsner malt.", "tasting_notes": "A crisp, bitter lager with a sharp, clean bitterness and noble hop character."}
    },
    {
        "recipe_id": "BohemianPilsner_20240805_31",
        "recipe_name": "Bohemian Pilsner (Pilsner Urquell Clone)",
        "beer_style": {"primary_style": "Bohemian Pilsner", "bjcp_code": "3B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 537, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.050, "final_gravity_sg": 1.014, "abv_percent": 4.7, "ibu_tinseth": 40, "srm_morey": 4},
        "ingredients": {
            "fermentables": [
                {"name": "Floor-Malted Bohemian Pilsner Malt", "weight_lbs": 680, "percentage": 100.0, "type": "Base Malt", "yield_percent": 80.0, "color_lovibond": 1.8}
            ],
            "hops": [
                {"name": "Saaz", "alpha_acid_percent": 3.5, "amount_oz": 48, "use": "Boil", "time_minutes": 75, "notes": "Bitterness: 18 IBU"},
                {"name": "Saaz", "alpha_acid_percent": 3.5, "amount_oz": 44.8, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 16 IBU"},
                {"name": "Saaz", "alpha_acid_percent": 3.5, "amount_oz": 36.8, "use": "Boil", "time_minutes": 10, "notes": "Aroma: 6 IBU"}
            ],
            "yeast": {"name": "Pilsner Urquell H-Strain", "lab": "Wyeast", "strain_code": "2001", "type": "Lager", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.5, "attenuation_percent": 72.0, "flocculation": "Medium", "optimum_temp_f": "48-58"},
            "water_chemistry": {"target_profile_name": "Pilsen Water (Soft)", "starting_water_ph": 7.0, "mash_ph": 5.3, "ions_ppm": {"calcium": 7, "magnesium": 3, "sodium": 2, "sulfate": 5, "chloride": 5}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [
                {"name": "Step 1", "temperature_f": 144, "duration_minutes": 20, "type": "Step"},
                {"name": "Step 2", "temperature_f": 154, "duration_minutes": 30, "type": "Step"}
            ],
            "boil_duration_minutes": 75,
            "fermentation_schedule": [
                {"name": "Primary Fermentation", "temperature_f": 50, "duration_days": 14},
                {"name": "Diacetyl rest", "temperature_f": 65, "duration_days": 5},
                {"name": "Lager", "temperature_f": 34, "duration_days": 42}
            ]
        },
        "notes": {"brewing_notes": "The original pilsner. Defined by its extremely soft water profile and complex malt character derived from decoction mashing. The entire hop bill consists of Saaz, providing a spicy, floral character.", "tasting_notes": "Complex malt character with a spicy, floral hop character."}
    },
    {
        "recipe_id": "HellesLager_20240805_32",
        "recipe_name": "Helles Lager",
        "beer_style": {"primary_style": "Helles Lager", "bjcp_code": "4A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.048, "final_gravity_sg": 1.009, "abv_percent": 5.1, "ibu_tinseth": 20, "srm_morey": 4},
        "ingredients": {
            "fermentables": [
                {"name": "German Pilsner Malt", "weight_lbs": 600, "percentage": 90.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5},
                {"name": "German Vienna Malt", "weight_lbs": 67, "percentage": 10.0, "type": "Base Malt", "yield_percent": 79.0, "color_lovibond": 3.5}
            ],
            "hops": [
                {"name": "Hallertau Mittelfrüh", "alpha_acid_percent": 4.0, "amount_oz": 19.2, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 15 IBU"},
                {"name": "Hallertau Mittelfrüh", "alpha_acid_percent": 4.0, "amount_oz": 24, "use": "Boil", "time_minutes": 10, "notes": "Aroma: 5 IBU"}
            ],
            "yeast": {"name": "Munich Lager", "lab": "Wyeast", "strain_code": "2308", "type": "Lager", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.5, "attenuation_percent": 75.0, "flocculation": "Medium", "optimum_temp_f": "48-56"},
            "water_chemistry": {"target_profile_name": "Yellow Balanced", "starting_water_ph": 7.0, "mash_ph": 5.3, "ions_ppm": {"calcium": 50, "magnesium": 7, "sodium": 5, "sulfate": 75, "chloride": 60}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 152, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [
                {"name": "Primary Fermentation", "temperature_f": 50, "duration_days": 10},
                {"name": "Diacetyl rest", "temperature_f": 60, "duration_days": 3},
                {"name": "Lager", "temperature_f": 34, "duration_days": 28}
            ]
        },
        "notes": {"brewing_notes": "A pale, malt-focused German lager. The 'Yellow Balanced' water profile supports the malt character without being overly mineralic. The goal is a clean, refreshing, and highly drinkable beer.", "tasting_notes": "A clean, refreshing, and highly drinkable beer with a pale, malt-focused character."}
    },
    {
        "recipe_id": "ViennaLager_20240805_33",
        "recipe_name": "Vienna Lager",
        "beer_style": {"primary_style": "Vienna Lager", "bjcp_code": "7A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.050, "final_gravity_sg": 1.011, "abv_percent": 5.1, "ibu_tinseth": 25, "srm_morey": 10},
        "ingredients": {
            "fermentables": [
                {"name": "Vienna Malt", "weight_lbs": 400, "percentage": 55.0, "type": "Base Malt", "yield_percent": 79.0, "color_lovibond": 3.5},
                {"name": "German Pilsner Malt", "weight_lbs": 255, "percentage": 35.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5},
                {"name": "Dark Munich Malt", "weight_lbs": 73, "percentage": 10.0, "type": "Base Malt", "yield_percent": 75.0, "color_lovibond": 20}
            ],
            "hops": [
                {"name": "German Northern Brewer", "alpha_acid_percent": 7.5, "amount_oz": 32, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 22 IBU"},
                {"name": "Czech Saaz", "alpha_acid_percent": 3.5, "amount_oz": 16, "use": "Boil", "time_minutes": 20, "notes": "Aroma: 3 IBU"}
            ],
            "yeast": {"name": "Harvest", "lab": "Imperial Yeast", "strain_code": "L17", "type": "Lager", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.5, "attenuation_percent": 75.0, "flocculation": "Medium", "optimum_temp_f": "52-57"},
            "water_chemistry": {"target_profile_name": "Vienna Water", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 35, "magnesium": 43, "sodium": 17, "sulfate": 67, "chloride": 21}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [
                {"name": "Protein rest", "temperature_f": 125, "duration_minutes": 30, "type": "Step"},
                {"name": "Beta-amylase rest", "temperature_f": 147, "duration_minutes": 30, "type": "Step"},
                {"name": "Alpha-amylase rest", "temperature_f": 162, "duration_minutes": 30, "type": "Step"}
            ],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [
                {"name": "Primary Fermentation", "temperature_f": 52, "duration_days": 10, "notes": "Pitch at 52°F (11°C) allow to rise to 54°F (12°C). When 2/3 attenuated, raise to 56°F (13°C)."},
                {"name": "Diacetyl rest", "temperature_f": 57, "duration_days": 2},
                {"name": "Lager", "temperature_f": 32, "duration_days": 28}
            ]
        },
        "notes": {"brewing_notes": "This recipe is based on the award-winning Devils Backbone Vienna Lager. The complex step mash and fermentation profile are key to developing its smooth, malty character.", "tasting_notes": "A smooth, malty lager with a toasty character."}
    },
    {
        "recipe_id": "MarzenOktoberfest_20240805_34",
        "recipe_name": "Märzen / Oktoberfest",
        "beer_style": {"primary_style": "Märzen", "bjcp_code": "6A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.058, "final_gravity_sg": 1.014, "abv_percent": 5.8, "ibu_tinseth": 22, "srm_morey": 11},
        "ingredients": {
            "fermentables": [
                {"name": "German Vienna Malt", "weight_lbs": 450, "percentage": 50.0, "type": "Base Malt", "yield_percent": 79.0, "color_lovibond": 3.5},
                {"name": "German Munich Malt (10L)", "weight_lbs": 450, "percentage": 50.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 10}
            ],
            "hops": [
                {"name": "Hallertau Mittelfrüh", "alpha_acid_percent": 4.0, "amount_oz": 24, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 22 IBU"}
            ],
            "yeast": {"name": "Oktoberfest/Märzen Lager Yeast", "lab": "White Labs", "strain_code": "WLP820", "type": "Lager", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.5, "attenuation_percent": 75.0, "flocculation": "Medium", "optimum_temp_f": "50-55"},
            "water_chemistry": {"target_profile_name": "Munich Water", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 45, "magnesium": 7, "sodium": 32, "sulfate": 46, "chloride": 46}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 152, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [
                {"name": "Primary Fermentation", "temperature_f": 48, "duration_days": 8, "notes": "Pitch at 48°F (9°C), let rise to 54°F (12°C) for 7-10 days."},
                {"name": "Diacetyl rest", "temperature_f": 72, "duration_days": 7},
                {"name": "Lager", "temperature_f": 33, "duration_days": 84}
            ]
        },
        "notes": {"brewing_notes": "A rich, malty lager traditionally brewed in March and lagered through the summer. The simple grain bill of Vienna and Munich malts provides a deep, bready, and toasty character. A long lagering period is essential.", "tasting_notes": "A rich, malty lager with a deep, bready, and toasty character."}
    },
    {
        "recipe_id": "DunkelLager_20240805_35",
        "recipe_name": "Dunkel Lager",
        "beer_style": {"primary_style": "Munich Dunkel", "bjcp_code": "8A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.054, "final_gravity_sg": 1.014, "abv_percent": 5.2, "ibu_tinseth": 25, "srm_morey": 20},
        "ingredients": {
            "fermentables": [
                {"name": "German Munich Malt (10L)", "weight_lbs": 800, "percentage": 90.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 10},
                {"name": "Carafa Special II (Dehusked)", "weight_lbs": 89, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 70.0, "color_lovibond": 415}
            ],
            "hops": [
                {"name": "Hallertau Mittelfrüh", "alpha_acid_percent": 4.0, "amount_oz": 32, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 25 IBU"}
            ],
            "yeast": {"name": "Munich Lager", "lab": "Wyeast", "strain_code": "2308", "type": "Lager", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.5, "attenuation_percent": 75.0, "flocculation": "Medium", "optimum_temp_f": "48-56"},
            "water_chemistry": {"target_profile_name": "Munich Water", "starting_water_ph": 7.0, "mash_ph": 5.5, "ions_ppm": {"calcium": 82, "magnesium": 20, "sodium": 4, "sulfate": 16, "chloride": 2}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [
                {"name": "Step 1", "temperature_f": 122, "duration_minutes": 30, "type": "Step"},
                {"name": "Step 2", "temperature_f": 149, "duration_minutes": 30, "type": "Step"},
                {"name": "Step 3", "temperature_f": 158, "duration_minutes": 20, "type": "Step"}
            ],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [
                {"name": "Primary Fermentation", "temperature_f": 48, "duration_days": 14},
                {"name": "Lager", "temperature_f": 41, "duration_days": 21}
            ]
        },
        "notes": {"brewing_notes": "The original dark lager of Munich. The high bicarbonate Munich water profile is crucial for balancing the acidity of the dark malts. Decoction mashing develops the deep melanoidin character.", "tasting_notes": "A dark lager with a deep melanoidin character and a smooth, malty finish."}
    },
    {
        "recipe_id": "Schwarzbier_20240805_36",
        "recipe_name": "Schwarzbier (Black Lager)",
        "beer_style": {"primary_style": "Schwarzbier", "bjcp_code": "8B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.050, "final_gravity_sg": 1.012, "abv_percent": 5.0, "ibu_tinseth": 28, "srm_morey": 30},
        "ingredients": {
            "fermentables": [
                {"name": "German Pilsner Malt", "weight_lbs": 520, "percentage": 70.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5},
                {"name": "German Munich Malt (10L)", "weight_lbs": 149, "percentage": 20.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 10},
                {"name": "Carafa Special II (Dehusked)", "weight_lbs": 74, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 70.0, "color_lovibond": 415}
            ],
            "hops": [
                {"name": "Magnum", "alpha_acid_percent": 14.0, "amount_oz": 40, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 28 IBU"}
            ],
            "yeast": {"name": "German Lager Yeast", "lab": "White Labs", "strain_code": "WLP830", "type": "Lager", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.5, "attenuation_percent": 76.0, "flocculation": "Medium", "optimum_temp_f": "50-55"},
            "water_chemistry": {"target_profile_name": "Munich Water", "starting_water_ph": 7.0, "mash_ph": 5.5, "ions_ppm": {"calcium": 82, "magnesium": 20, "sodium": 4, "sulfate": 16, "chloride": 2}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 152, "duration_minutes": 60, "type": "Infusion", "notes": "Add Carafa Special during the last 15 minutes of the mash (mash capping) to minimize harshness."}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [
                {"name": "Primary Fermentation", "temperature_f": 50, "duration_days": 12},
                {"name": "Lager", "temperature_f": 34, "duration_days": 28}
            ]
        },
        "notes": {"brewing_notes": "A dark lager that is surprisingly light-bodied and drinkable. The key is to get the dark color and subtle roast flavor without the associated astringency, which is achieved through mash capping with dehusked black malt and using a high-bicarbonate water profile.", "tasting_notes": "A light-bodied dark lager with a subtle roast flavor and minimal astringency."}
    },
    {
        "recipe_id": "Bock_20240805_37",
        "recipe_name": "Bock",
        "beer_style": {"primary_style": "Bock", "bjcp_code": "4C"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.068, "final_gravity_sg": 1.018, "abv_percent": 6.6, "ibu_tinseth": 25, "srm_morey": 25},
        "ingredients": {
            "fermentables": [
                {"name": "German Munich Malt (10L)", "weight_lbs": 900, "percentage": 90.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 10},
                {"name": "Caramunich Malt", "weight_lbs": 100, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 71.0, "color_lovibond": 56}
            ],
            "hops": [
                {"name": "Hallertau Mittelfrüh", "alpha_acid_percent": 4.0, "amount_oz": 32, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 25 IBU"}
            ],
            "yeast": {"name": "Bavarian Lager", "lab": "Wyeast", "strain_code": "2206", "type": "Lager", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.5, "attenuation_percent": 75.0, "flocculation": "Medium", "optimum_temp_f": "48-58"},
            "water_chemistry": {"target_profile_name": "Munich Water", "starting_water_ph": 7.0, "mash_ph": 5.5, "ions_ppm": {"calcium": 82, "magnesium": 20, "sodium": 4, "sulfate": 16, "chloride": 2}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [
                {"name": "Step 1", "temperature_f": 122, "duration_minutes": 30, "type": "Step"},
                {"name": "Step 2", "temperature_f": 140, "duration_minutes": 30, "type": "Step"},
                {"name": "Step 3", "temperature_f": 158, "duration_minutes": 30, "type": "Step"}
            ],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [
                {"name": "Primary Fermentation", "temperature_f": 50, "duration_days": 14},
                {"name": "Diacetyl rest", "temperature_f": 60, "duration_days": 3},
                {"name": "Lager", "temperature_f": 34, "duration_days": 49}
            ]
        },
        "notes": {"brewing_notes": "A strong, malty, dark German lager. The high percentage of Munich malt and decoction mash create a rich, bready, and complex malt profile.", "tasting_notes": "A strong, malty, dark German lager with a rich, bready, and complex malt profile."}
    },
    {
        "recipe_id": "Doppelbock_20240805_38",
        "recipe_name": "Doppelbock",
        "beer_style": {"primary_style": "Doppelbock", "bjcp_code": "9A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.086, "final_gravity_sg": 1.020, "abv_percent": 8.7, "ibu_tinseth": 24, "srm_morey": 19},
        "ingredients": {
            "fermentables": [
                {"name": "German Munich Malt (10L)", "weight_lbs": 1000, "percentage": 75.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 10},
                {"name": "German Pilsner Malt", "weight_lbs": 200, "percentage": 15.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5},
                {"name": "Caramunich III Malt", "weight_lbs": 133, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 70.0, "color_lovibond": 70}
            ],
            "hops": [
                {"name": "Hallertau Mittelfrüh", "alpha_acid_percent": 4.0, "amount_oz": 32, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 24 IBU"}
            ],
            "yeast": {"name": "German Bock Lager", "lab": "White Labs", "strain_code": "WLP833", "type": "Lager", "form": "Liquid", "pitch_rate_million_cells_per_ml": 2.0, "attenuation_percent": 75.0, "flocculation": "Medium", "optimum_temp_f": "48-55"},
            "water_chemistry": {"target_profile_name": "Soft Lager Profile", "starting_water_ph": 7.0, "mash_ph": 5.5, "ions_ppm": {"calcium": 50, "magnesium": 0, "sodium": 15, "sulfate": 55, "chloride": 65}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 155, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [
                {"name": "Primary Fermentation", "temperature_f": 44, "duration_days": 14, "notes": "Pitch at 44°F (7°C), allow to rise to 50°F (10°C) for primary fermentation."},
                {"name": "Diacetyl rest", "temperature_f": 60, "duration_days": 3},
                {"name": "Lager", "temperature_f": 32, "duration_days": 90}
            ]
        },
        "notes": {"brewing_notes": "'Liquid bread.' A very strong and intensely malty lager. A long, cold lagering period is essential to smooth out the high alcohol content and develop the complex malt flavors.", "tasting_notes": "A very strong and intensely malty lager with complex malt flavors."}
    },
    {
        "recipe_id": "Maibock_HellesBock_20240805_39",
        "recipe_name": "Maibock / Helles Bock",
        "beer_style": {"primary_style": "Helles Bock", "bjcp_code": "4B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.068, "final_gravity_sg": 1.014, "abv_percent": 7.1, "ibu_tinseth": 30, "srm_morey": 8},
        "ingredients": {
            "fermentables": [
                {"name": "German Pilsner Malt", "weight_lbs": 700, "percentage": 70.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5},
                {"name": "German Vienna Malt", "weight_lbs": 300, "percentage": 30.0, "type": "Base Malt", "yield_percent": 79.0, "color_lovibond": 3.5}
            ],
            "hops": [
                {"name": "Magnum", "alpha_acid_percent": 14.0, "amount_oz": 32, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 25 IBU"},
                {"name": "Hallertau Mittelfrüh", "alpha_acid_percent": 4.0, "amount_oz": 32, "use": "Boil", "time_minutes": 15, "notes": "Aroma: 5 IBU"}
            ],
            "yeast": {"name": "Bavarian Lager", "lab": "Wyeast", "strain_code": "2206", "type": "Lager", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.5, "attenuation_percent": 75.0, "flocculation": "Medium", "optimum_temp_f": "48-58"},
            "water_chemistry": {"target_profile_name": "Soft Lager Profile", "starting_water_ph": 7.0, "mash_ph": 5.3, "ions_ppm": {"calcium": 21, "magnesium": 5, "sodium": 18, "sulfate": 21, "chloride": 16}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 152, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [
                {"name": "Primary Fermentation", "temperature_f": 50, "duration_days": 10, "notes": "with a slow rise over the first few days."},
                {"name": "Lager", "temperature_f": 34, "duration_days": 42}
            ]
        },
        "notes": {"brewing_notes": "A paler, hoppier version of a bock, traditionally released in May. The soft water profile is important to avoid a harsh hop bitterness.", "tasting_notes": "A paler, hoppier bock with a clean lager character."}
    },
    {
        "recipe_id": "CaliforniaCommon_20240805_40",
        "recipe_name": "California Common",
        "beer_style": {"primary_style": "California Common", "bjcp_code": "19B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.050, "final_gravity_sg": 1.012, "abv_percent": 5.0, "ibu_tinseth": 40, "srm_morey": 12},
        "ingredients": {
            "fermentables": [
                {"name": "American 2-Row Pale Malt", "weight_lbs": 650, "percentage": 90.0, "type": "Base Malt", "yield_percent": 80.0, "color_lovibond": 1.8},
                {"name": "American Crystal Malt (40L)", "weight_lbs": 72, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 75.0, "color_lovibond": 40}
            ],
            "hops": [
                {"name": "Northern Brewer", "alpha_acid_percent": 9.0, "amount_oz": 56, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 40 IBU"}
            ],
            "yeast": {"name": "San Francisco Lager Yeast", "lab": "White Labs", "strain_code": "WLP810", "type": "Lager", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.0, "attenuation_percent": 70.0, "flocculation": "High", "optimum_temp_f": "58-65"},
            "water_chemistry": {"target_profile_name": "Balanced Profile", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 50, "magnesium": 10, "sodium": 16, "sulfate": 77, "chloride": 66}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 148, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 60, "duration_days": 8}]
        },
        "notes": {"brewing_notes": "A uniquely American style, fermented with a lager yeast at warmer, ale-like temperatures. This produces a beer with the crispness of a lager and some of the subtle fruitiness of an ale. Northern Brewer hops provide a characteristic woody, minty character.", "tasting_notes": "A crisp lager with subtle fruitiness and a characteristic woody, minty hop character."}
    },
    {
        "recipe_id": "ScottishAle_20240805_41",
        "recipe_name": "Scottish Ale",
        "beer_style": {"primary_style": "Scottish Export", "bjcp_code": "14C"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 555, "post_boil_gallons": 488, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.050, "final_gravity_sg": 1.014, "abv_percent": 4.7, "ibu_tinseth": 25, "srm_morey": 15},
        "ingredients": {
            "fermentables": [
                {"name": "Golden Promise Pale Ale Malt", "weight_lbs": 650, "percentage": 90.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 2.5},
                {"name": "British Crystal Malt (60L)", "weight_lbs": 72, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 74.0, "color_lovibond": 60}
            ],
            "hops": [
                {"name": "East Kent Goldings", "alpha_acid_percent": 5.0, "amount_oz": 32, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 25 IBU"}
            ],
            "yeast": {"name": "Scottish Ale", "lab": "Wyeast", "strain_code": "1728", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 75.0, "flocculation": "High", "optimum_temp_f": "55-75"},
            "water_chemistry": {"target_profile_name": "Edinburgh Water", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 100, "magnesium": 18, "sodium": 20, "sulfate": 105, "chloride": 45}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 154, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 90,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 64, "duration_days": 8}]
        },
        "notes": {"brewing_notes": "A malt-forward ale with rich toffee and caramel notes. A long boil (90+ minutes) is traditional and helps develop caramelization (kettle caramelization) for added flavor complexity.", "tasting_notes": "A malt-forward ale with rich toffee and caramel notes."}
    },
    {
        "recipe_id": "WeeHeavy_20240805_42",
        "recipe_name": "Wee Heavy (Strong Scotch Ale)",
        "beer_style": {"primary_style": "Wee Heavy", "bjcp_code": "17C"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 612, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.091, "final_gravity_sg": 1.025, "abv_percent": 8.8, "ibu_tinseth": 36, "srm_morey": 20},
        "ingredients": {
            "fermentables": [
                {"name": "Golden Promise Pale Ale Malt", "weight_lbs": 1200, "percentage": 96.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 2.5},
                {"name": "Roasted Barley", "weight_lbs": 50, "percentage": 4.0, "type": "Specialty Malt", "yield_percent": 55.0, "color_lovibond": 500}
            ],
            "hops": [
                {"name": "East Kent Goldings", "alpha_acid_percent": 5.0, "amount_oz": 64, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 36 IBU"}
            ],
            "yeast": {"name": "Edinburgh Scottish Ale", "lab": "White Labs", "strain_code": "WLP028", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.25, "attenuation_percent": 75.0, "flocculation": "High", "optimum_temp_f": "65-70"},
            "water_chemistry": {"target_profile_name": "Edinburgh Water", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 101, "magnesium": 10, "sodium": 46, "sulfate": 74, "chloride": 75}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 152, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 120,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 63, "duration_days": 10, "notes": "Allow to free-rise to 67°F (19°C) over the first 4 days."}]
        },
        "notes": {"brewing_notes": "A very strong, intensely malty ale. A long boil of at least 120 minutes is essential to develop the deep caramel and toffee flavors through kettle caramelization.", "tasting_notes": "A very strong, intensely malty ale with deep caramel and toffee flavors."}
    },
    {
        "recipe_id": "Rauchbier_20240805_43",
        "recipe_name": "Rauchbier (Smoked Beer)",
        "beer_style": {"primary_style": "Rauchbier", "bjcp_code": "6B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.054, "final_gravity_sg": 1.014, "abv_percent": 5.3, "ibu_tinseth": 25, "srm_morey": 18},
        "ingredients": {
            "fermentables": [
                {"name": "Weyermann Beechwood Smoked Malt", "weight_lbs": 600, "percentage": 80.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 2.5},
                {"name": "German Munich Malt (10L)", "weight_lbs": 150, "percentage": 20.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 10}
            ],
            "hops": [
                {"name": "German Tettnanger", "alpha_acid_percent": 4.5, "amount_oz": 32, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 25 IBU"}
            ],
            "yeast": {"name": "Bohemian Lager", "lab": "Wyeast", "strain_code": "2124", "type": "Lager", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.5, "attenuation_percent": 75.0, "flocculation": "Medium", "optimum_temp_f": "48-58"},
            "water_chemistry": {"target_profile_name": "Bamberg Water", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 73, "magnesium": 0, "sodium": 8, "sulfate": 81, "chloride": 52}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [
                {"name": "Step 1", "temperature_f": 144, "duration_minutes": 30, "type": "Step"},
                {"name": "Step 2", "temperature_f": 154, "duration_minutes": 20, "type": "Step"}
            ],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [
                {"name": "Primary Fermentation", "temperature_f": 52, "duration_days": 14},
                {"name": "Lager", "temperature_f": 30, "duration_days": 52}
            ]
        },
        "notes": {"brewing_notes": "A Märzen-style lager made with a large proportion of smoked malt. The key is balancing the smoke character with the rich maltiness. The smoke should be prominent but not acrid.", "tasting_notes": "A lager with a prominent but not acrid smoke character, balanced with rich maltiness."}
    },
    {
        "recipe_id": "Gose_20240805_44",
        "recipe_name": "Gose",
        "beer_style": {"primary_style": "Gose", "bjcp_code": "27A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.042, "final_gravity_sg": 1.008, "abv_percent": 4.5, "ibu_tinseth": 9, "srm_morey": 3},
        "ingredients": {
            "fermentables": [
                {"name": "German Wheat Malt", "weight_lbs": 350, "percentage": 55.0, "type": "Base Malt", "yield_percent": 85.0, "color_lovibond": 2},
                {"name": "German Pilsner Malt", "weight_lbs": 286, "percentage": 45.0, "type": "Base Malt", "yield_percent": 81.0, "color_lovibond": 1.5}
            ],
            "hops": [
                {"name": "Czech Saaz", "alpha_acid_percent": 3.0, "amount_oz": 16, "use": "First Wort", "time_minutes": 60, "notes": "Bitterness: 9 IBU"}
            ],
            "yeast": {"name": "German Ale", "lab": "Wyeast", "strain_code": "1007", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 75.0, "flocculation": "Low", "optimum_temp_f": "55-68"},
            "water_chemistry": {"target_profile_name": "Leipzig Water", "starting_water_ph": 7.0, "mash_ph": 5.2, "ions_ppm": {"calcium": 50, "magnesium": 10, "sodium": 200, "sulfate": 50, "chloride": 100}, "additions": []},
            "other_ingredients": [
                {"name": "Crushed Coriander", "amount_lbs": 1.0, "use": "End of Boil"},
                {"name": "Sea Salt", "amount_lbs": 1.25, "use": "End of Boil"},
                {"name": "Lactobacillus plantarum", "amount_ml": 0, "use": "Kettle Sour"}
            ]
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 149, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 15,
            "fermentation_schedule": [
                {"name": "Kettle Souring", "temperature_f": 95, "duration_days": 2, "notes": "Hold for 24-48 hours until desired pH (typically 3.2-3.4) is reached."},
                {"name": "Primary Fermentation", "temperature_f": 65, "duration_days": 8}
            ]
        },
        "notes": {"brewing_notes": "A tart, salty, and refreshing wheat beer. Kettle souring is the modern commercial method for achieving a clean, consistent lactic sourness. The high sodium and chloride levels are characteristic of the style.", "tasting_notes": "A tart, salty, and refreshing wheat beer with a clean lactic sourness."}
    },
    {
        "recipe_id": "FlandersRedAle_20240805_45",
        "recipe_name": "Flanders Red Ale",
        "beer_style": {"primary_style": "Flanders Red Ale", "bjcp_code": "23B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.052, "final_gravity_sg": 1.008, "abv_percent": 5.8, "ibu_tinseth": 15, "srm_morey": 15},
        "ingredients": {
            "fermentables": [
                {"name": "Vienna Malt", "weight_lbs": 450, "percentage": 65.0, "type": "Base Malt", "yield_percent": 79.0, "color_lovibond": 3.5},
                {"name": "Munich Malt (10L)", "weight_lbs": 138, "percentage": 20.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 10},
                {"name": "Special B Malt", "weight_lbs": 69, "percentage": 10.0, "type": "Specialty Malt", "yield_percent": 68.0, "color_lovibond": 180},
                {"name": "Flaked Maize", "weight_lbs": 34, "percentage": 5.0, "type": "Adjunct", "yield_percent": 80.0, "color_lovibond": 0.5}
            ],
            "hops": [
                {"name": "Kent Goldings", "alpha_acid_percent": 5.0, "amount_oz": 24, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 15 IBU"}
            ],
            "yeast": {"name": "Roeselare Ale Blend", "lab": "Wyeast", "strain_code": "3763", "type": "Mixed Culture", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.0, "attenuation_percent": 85.0, "flocculation": "Medium", "optimum_temp_f": "68-85"},
            "water_chemistry": {"target_profile_name": "Balanced Belgian Profile", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 50, "magnesium": 10, "sodium": 16, "sulfate": 70, "chloride": 70}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 156, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [
                {"name": "Primary Fermentation", "temperature_f": 68, "duration_days": 18},
                {"name": "Secondary Aging", "temperature_f": 68, "duration_days": 365, "notes": "Rack to secondary aging vessels (barrels or stainless with oak cubes) for an extended period of 6-18 months."}
            ]
        },
        "notes": {"brewing_notes": "A complex, sour, and fruity Belgian ale. Patience is the key ingredient. The final product is often a blend of young and old beer to achieve the desired balance of acidity and malt character.", "tasting_notes": "A complex, sour, and fruity Belgian ale with a balance of acidity and malt character."}
    },
    {
        "recipe_id": "SierraNevadaPaleAleClone_20240805_46",
        "recipe_name": "Sierra Nevada Pale Ale Clone",
        "beer_style": {"primary_style": "American Pale Ale", "bjcp_code": "18B"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.053, "final_gravity_sg": 1.011, "abv_percent": 5.6, "ibu_tinseth": 37, "srm_morey": 10},
        "ingredients": {
            "fermentables": [
                {"name": "American 2-Row Pale Malt", "weight_lbs": 660, "percentage": 88.0, "type": "Base Malt", "yield_percent": 80.0, "color_lovibond": 1.8},
                {"name": "Crystal Malt (60L)", "weight_lbs": 90, "percentage": 12.0, "type": "Specialty Malt", "yield_percent": 74.0, "color_lovibond": 60}
            ],
            "hops": [
                {"name": "Magnum", "alpha_acid_percent": 14.0, "amount_oz": 16, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 18 IBU"},
                {"name": "Perle", "alpha_acid_percent": 7.0, "amount_oz": 16, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 9 IBU"},
                {"name": "Cascade", "alpha_acid_percent": 6.0, "amount_oz": 64, "use": "Boil", "time_minutes": 30, "notes": "Flavor: 10 IBU"},
                {"name": "Cascade", "alpha_acid_percent": 6.0, "amount_oz": 64, "use": "Whirlpool", "time_minutes": 0, "notes": "Aroma"}
            ],
            "yeast": {"name": "California Ale Yeast", "lab": "White Labs", "strain_code": "WLP001", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 0.75, "attenuation_percent": 80.0, "flocculation": "Medium", "optimum_temp_f": "68-73"},
            "water_chemistry": {"target_profile_name": "Hoppy Pale Ale Profile", "starting_water_ph": 7.0, "mash_ph": 5.3, "ions_ppm": {"calcium": 100, "magnesium": 15, "sodium": 10, "sulfate": 150, "chloride": 50}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 155, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 68, "duration_days": 8}]
        },
        "notes": {"brewing_notes": "Based on published clone recipes for the iconic American Pale Ale. The use of whole cone Cascade hops is traditional, but pellets are a suitable substitute. The water profile accentuates a crisp hop finish.", "tasting_notes": "A classic American Pale Ale with a crisp hop finish and citrusy hop notes."}
    },
    {
        "recipe_id": "BellsTwoHeartedAleClone_20240805_47",
        "recipe_name": "Bell's Two Hearted Ale Clone",
        "beer_style": {"primary_style": "American IPA", "bjcp_code": "21A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.065, "final_gravity_sg": 1.011, "abv_percent": 7.1, "ibu_tinseth": 60, "srm_morey": 7},
        "ingredients": {
            "fermentables": [
                {"name": "American 2-Row Pale Malt", "weight_lbs": 800, "percentage": 75.0, "type": "Base Malt", "yield_percent": 80.0, "color_lovibond": 1.8},
                {"name": "American Pale Ale Malt", "weight_lbs": 214, "percentage": 20.0, "type": "Base Malt", "yield_percent": 80.0, "color_lovibond": 3.5},
                {"name": "Crystal Malt (40L)", "weight_lbs": 53, "percentage": 5.0, "type": "Specialty Malt", "yield_percent": 75.0, "color_lovibond": 40}
            ],
            "hops": [
                {"name": "Centennial", "alpha_acid_percent": 10.0, "amount_oz": 56, "use": "Boil", "time_minutes": 45, "notes": "Bitterness: 35 IBU"},
                {"name": "Centennial", "alpha_acid_percent": 10.0, "amount_oz": 56, "use": "Boil", "time_minutes": 30, "notes": "Flavor: 25 IBU"},
                {"name": "Centennial", "alpha_acid_percent": 10.0, "amount_oz": 160, "use": "Dry Hop", "time_days": 7, "notes": "Aroma"}
            ],
            "yeast": {"name": "Bell's House Yeast", "lab": "Imperial Yeast", "strain_code": "A62", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.0, "attenuation_percent": 80.0, "flocculation": "Medium", "optimum_temp_f": "64-72"},
            "water_chemistry": {"target_profile_name": "Assertive IPA Profile", "starting_water_ph": 7.0, "mash_ph": 5.4, "ions_ppm": {"calcium": 100, "magnesium": 15, "sodium": 10, "sulfate": 200, "chloride": 50}, "additions": []},
            "other_ingredients": []
        },
        "process": {
            "mash_schedule": [
                {"name": "Step 1", "temperature_f": 150, "duration_minutes": 45, "type": "Step"},
                {"name": "Step 2", "temperature_f": 170, "duration_minutes": 10, "type": "Step"}
            ],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 64, "duration_days": 10, "notes": "Dry hop one week into fermentation."}]
        },
        "notes": {"brewing_notes": "This iconic IPA is famous for its exclusive use of Centennial hops. The recipe is based on information released by the brewery. The specific house yeast contributes a unique ester profile, but clean American ale strains provide a very close approximation.", "tasting_notes": "An IPA with a prominent Centennial hop character and a unique ester profile from the yeast."}
    },
    {
        "recipe_id": "RussianRiverPlinyTheElderClone_20240805_48",
        "recipe_name": "Russian River Pliny the Elder Clone",
        "beer_style": {"primary_style": "Imperial IPA", "bjcp_code": "22A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 555, "post_boil_gallons": 488, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.072, "final_gravity_sg": 1.011, "abv_percent": 8.0, "ibu_tinseth": 123, "srm_morey": 7},
        "ingredients": {
            "fermentables": [
                {"name": "American 2-Row Pale Malt", "weight_lbs": 1000, "percentage": 90.0, "type": "Base Malt", "yield_percent": 80.0, "color_lovibond": 1.8},
                {"name": "Crystal Malt (45L)", "weight_lbs": 55, "percentage": 5.0, "type": "Specialty Malt", "yield_percent": 75.0, "color_lovibond": 45},
                {"name": "Carapils/Dextrine Malt", "weight_lbs": 55, "percentage": 5.0, "type": "Specialty Malt", "yield_percent": 72.0, "color_lovibond": 1.5}
            ],
            "hops": [
                {"name": "Columbus", "alpha_acid_percent": 14.0, "amount_oz": 128, "use": "Boil", "time_minutes": 90, "notes": "Bitterness: 90 IBU"},
                {"name": "Columbus", "alpha_acid_percent": 14.0, "amount_oz": 27.2, "use": "Boil", "time_minutes": 45, "notes": "Bitterness: 15 IBU"},
                {"name": "Simcoe", "alpha_acid_percent": 13.0, "amount_oz": 35.2, "use": "Boil", "time_minutes": 30, "notes": "Flavor: 18 IBU"},
                {"name": "Centennial", "alpha_acid_percent": 10.0, "amount_oz": 35.2, "use": "Whirlpool", "time_minutes": 0, "notes": "Aroma"},
                {"name": "Simcoe", "alpha_acid_percent": 13.0, "amount_oz": 88, "use": "Whirlpool", "time_minutes": 0, "notes": "Aroma"},
                {"name": "Columbus", "alpha_acid_percent": 14.0, "amount_oz": 35.2, "use": "Dry Hop", "time_days": 9, "notes": "Dry Hop 1"},
                {"name": "Centennial", "alpha_acid_percent": 10.0, "amount_oz": 35.2, "use": "Dry Hop", "time_days": 9, "notes": "Dry Hop 1"},
                {"name": "Simcoe", "alpha_acid_percent": 13.0, "amount_oz": 35.2, "use": "Dry Hop", "time_days": 9, "notes": "Dry Hop 1"},
                {"name": "Columbus", "alpha_acid_percent": 14.0, "amount_oz": 8, "use": "Dry Hop", "time_days": 5, "notes": "Dry Hop 2"},
                {"name": "Centennial", "alpha_acid_percent": 10.0, "amount_oz": 8, "use": "Dry Hop", "time_days": 5, "notes": "Dry Hop 2"},
                {"name": "Simcoe", "alpha_acid_percent": 13.0, "amount_oz": 8, "use": "Dry Hop", "time_days": 5, "notes": "Dry Hop 2"}
            ],
            "yeast": {"name": "California Ale Yeast", "lab": "White Labs", "strain_code": "WLP001", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.25, "attenuation_percent": 80.0, "flocculation": "Medium", "optimum_temp_f": "68-73"},
            "water_chemistry": {"target_profile_name": "High Sulfate DIPA Profile", "starting_water_ph": 7.0, "mash_ph": 5.2, "ions_ppm": {"calcium": 110, "magnesium": 18, "sodium": 16, "sulfate": 300, "chloride": 50}, "additions": []},
            "other_ingredients": [{"name": "Dextrose", "amount_lbs": 65, "use": "Kettle"}]
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 151, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 90,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 67, "duration_days": 14, "notes": "Rack to secondary for the extensive dry hopping schedule."}]
        },
        "notes": {"brewing_notes": "Based on the original recipe published by Vinnie Cilurzo. This is the archetypal Double IPA. The massive and complex hop schedule is the defining feature. A 90-minute boil is required.", "tasting_notes": "The archetypal Double IPA with a massive and complex hop schedule."}
    },
    {
        "recipe_id": "TheAlchemistHeadyTopperClone_20240805_49",
        "recipe_name": "The Alchemist Heady Topper Clone",
        "beer_style": {"primary_style": "Imperial IPA", "bjcp_code": "22A"},
        "author": "AI_Brewmaster_v1",
        "version": 1.0,
        "batch_info": {"batch_size_gallons": 465, "pre_boil_gallons": 522, "post_boil_gallons": 480, "efficiency_percent": 85.0},
        "target_parameters": {"original_gravity_sg": 1.076, "final_gravity_sg": 1.014, "abv_percent": 8.2, "ibu_tinseth": 100, "srm_morey": 6},
        "ingredients": {
            "fermentables": [
                {"name": "British Pale Ale Malt (Maris Otter)", "weight_lbs": 1100, "percentage": 90.0, "type": "Base Malt", "yield_percent": 78.0, "color_lovibond": 3},
                {"name": "Caravienne Malt", "weight_lbs": 55, "percentage": 5.0, "type": "Specialty Malt", "yield_percent": 74.0, "color_lovibond": 22},
                {"name": "Turbinado Sugar", "weight_lbs": 55, "percentage": 5.0, "type": "Sugar", "yield_percent": 100.0, "color_lovibond": 10}
            ],
            "hops": [
                {"name": "Magnum", "alpha_acid_percent": 14.0, "amount_oz": 24, "use": "Boil", "time_minutes": 60, "notes": "Bitterness: 30 IBU"},
                {"name": "Simcoe", "alpha_acid_percent": 13.0, "amount_oz": 35.2, "use": "Boil", "time_minutes": 30, "notes": "Flavor: 25 IBU"},
                {"name": "Cascade", "alpha_acid_percent": 6.0, "amount_oz": 35.2, "use": "Whirlpool", "time_minutes": 30, "temperature_f": 170, "notes": "Aroma"},
                {"name": "Apollo", "alpha_acid_percent": 17.0, "amount_oz": 17.6, "use": "Whirlpool", "time_minutes": 30, "temperature_f": 170, "notes": "Aroma"},
                {"name": "Simcoe", "alpha_acid_percent": 13.0, "amount_oz": 35.2, "use": "Whirlpool", "time_minutes": 30, "temperature_f": 170, "notes": "Aroma"},
                {"name": "Centennial", "alpha_acid_percent": 10.0, "amount_oz": 35.2, "use": "Whirlpool", "time_minutes": 30, "temperature_f": 170, "notes": "Aroma"},
                {"name": "Columbus", "alpha_acid_percent": 14.0, "amount_oz": 17.6, "use": "Whirlpool", "time_minutes": 30, "temperature_f": 170, "notes": "Aroma"},
                {"name": "Chinook", "alpha_acid_percent": 12.0, "amount_oz": 35.2, "use": "Dry Hop", "time_days": 7, "notes": "Dry Hop 1"},
                {"name": "Apollo", "alpha_acid_percent": 17.0, "amount_oz": 35.2, "use": "Dry Hop", "time_days": 7, "notes": "Dry Hop 1"},
                {"name": "Simcoe", "alpha_acid_percent": 13.0, "amount_oz": 35.2, "use": "Dry Hop", "time_days": 7, "notes": "Dry Hop 1"},
                {"name": "Centennial", "alpha_acid_percent": 10.0, "amount_oz": 44, "use": "Dry Hop", "time_days": 5, "notes": "Dry Hop 2 (in keg/brite)"},
                {"name": "Simcoe", "alpha_acid_percent": 13.0, "amount_oz": 44, "use": "Dry Hop", "time_days": 5, "notes": "Dry Hop 2 (in keg/brite)"}
            ],
            "yeast": {"name": "Vermont Ale", "lab": "The Yeast Bay", "strain_code": "GY054", "type": "Ale", "form": "Liquid", "pitch_rate_million_cells_per_ml": 1.0, "attenuation_percent": 80.0, "flocculation": "Medium", "optimum_temp_f": "65-70"},
            "water_chemistry": {"target_profile_name": "NEIPA Soft Profile", "starting_water_ph": 7.0, "mash_ph": 5.3, "ions_ppm": {"calcium": 100, "magnesium": 18, "sodium": 16, "sulfate": 100, "chloride": 200}, "additions": []},
            "other_ingredients": [{"name": "Turbinado Sugar", "amount_lbs": 55, "use": "Kettle"}]
        },
        "process": {
            "mash_schedule": [{"name": "Single infusion mash", "temperature_f": 153, "duration_minutes": 60, "type": "Infusion"}],
            "boil_duration_minutes": 60,
            "fermentation_schedule": [{"name": "Primary Fermentation", "temperature_f": 68, "duration_days": 12, "notes": "Add first dry hops after terminal gravity is reached. Rack off yeast and first dry hops before the second dry hop addition."}]
        },
        "notes": {"brewing_notes": "A foundational Hazy/New England style Double IPA. The 'Conan' yeast strain is legendary for its peachy ester profile. The water profile, with a 2:1 chloride-to-sulfate ratio, is critical for the soft mouthfeel. The extensive whirlpool and multi-stage dry hopping build layers of hop aroma and flavor.", "tasting_notes": "A Hazy/New England style Double IPA with a peachy ester profile and layers of hop aroma and flavor."}
    }
]

def create_recipe_files():
    """
    Iterates through a list of recipe dictionaries, creating a separate
    JSON file for each recipe. The filename is derived from the recipe_id.
    """
    # Create a directory to store the recipe files if it doesn't exist
    output_dir = "recipes"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Loop through each recipe in the data list
    for recipe in recipes_data:
        # Get the recipe_id to use as the filename
        recipe_id = recipe.get("recipe_id")
        if not recipe_id:
            print("Skipping a recipe because it's missing a 'recipe_id'.")
            continue

        # Construct the full file path
        file_path = os.path.join(output_dir, f"{recipe_id}.json")

        try:
            # Open the file in write mode
            with open(file_path, 'w') as json_file:
                # Write the recipe dictionary to the file
                # indent=4 makes the JSON file human-readable
                json.dump(recipe, json_file, indent=4)
            
            print(f"Successfully created file: {file_path}")

        except IOError as e:
            print(f"Error writing to file {file_path}: {e}")
        except TypeError as e:
            print(f"Error serializing recipe {recipe_id}: {e}")


# Run the function to create the files
if __name__ == "__main__":
    create_recipe_files()
