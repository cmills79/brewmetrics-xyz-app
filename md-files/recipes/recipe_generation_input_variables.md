# BrewMetrics Recipe Designer - Input Variables

This document outlines all the variables and instructions a brewer can input into the BrewMetrics Recipe Designer to create a new recipe. The inputs are organized by the tabs in the user interface.

## Design Tab

This is the primary tab for defining the core components of the recipe.

### Recipe Information

These fields define the basic metadata and parameters for the batch.

| Field | ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Name | `recipe-name` | Text | The name of the recipe. |
| Type | `recipe-type` | Select | The brewing method. Options: `All Grain`, `Extract`, `Partial Mash`. |
| Boil Time | `boil-time` | Number | The duration of the boil in minutes. |
| Date | `brew-date` | Date | The date the recipe was created or is scheduled to be brewed. |
| Brewer | `brewer` | Text | The name of the person who created the recipe. |
| Batch Vol | `batch-vol` | Number | The final volume of the batch in gallons. |
| Efficiency | `efficiency` | Number | The brewhouse efficiency as a percentage. |
| Sharing | `sharing` | Select | The privacy setting for the recipe. Options: `Private`, `Public`, `Brewery Only`. |
| Equip | `equipment` | Text | A description of the brewing equipment used. |
| Pre-Boil | `pre-boil` | Number | The volume of wort before the boil in gallons. |
| Version | `version` | Text | The version number of the recipe (e.g., 1.0). |
| Locked | `locked` | Checkbox | Prevents accidental changes to the recipe. |

### Style Information

| Field | ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Style | `beer-style` | Select | The BJCP or commercial style guideline for the beer. This affects the visual style guideline sliders. |

### Ingredients

Ingredients are added via modals.

#### Fermentables

* **Action**: Click "Add Fermentable" button.
* **Inputs**:
  * **Name**: Select from a predefined list of malts and grains.
  * **Amount**: The weight of the fermentable in pounds (lbs).

#### Hops

* **Action**: Click "Add Hops" button.
* **Inputs**:
  * **Name**: Select from a predefined list of hop varieties.
  * **Amount**: The weight of the hops in ounces (oz).
  * **Boil Time**: The time in minutes the hops are in the boil.
  * **Use Type (Advanced)**: The stage at which hops are added. Options: `Boil`, `Whirlpool`, `Dry Hop`.
  * **Whirlpool Temp (Advanced)**: The temperature for a whirlpool addition in °F.
  * **Whirlpool Time (Advanced)**: The duration for a whirlpool addition in minutes.
  * **Dry Hop Time (Advanced)**: The contact time for a dry hop addition in days.

#### Yeast

* **Action**: Click "Add Yeast" button.
* **Inputs**:
  * **Name**: Select from a predefined list of yeast strains.
  * **Amount**: The number of packages or vials.

---

## Starter Tab

This tab is for calculating the requirements for a yeast starter.

| Field | ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Starter Gravity | `starter-gravity` | Number | The specific gravity of the starter wort (e.g., 1.040). |
| Starter Volume | `starter-volume` | Number | The total volume of the starter in Liters (L). |
| Yeast Viability | `yeast-viability` | Number | The estimated viability of the yeast pack as a percentage. |

---

## Water Tab

This tab is for calculating water chemistry adjustments.

### Source Water Profile

These fields define the brewer's starting water mineral content.

| Field | ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Calcium (Ca²⁺) | `calcium` | Number | Calcium content in parts per million (ppm). |
| Magnesium (Mg²⁺) | `magnesium` | Number | Magnesium content in ppm. |
| Sodium (Na⁺) | `sodium` | Number | Sodium content in ppm. |
| Chloride (Cl⁻) | `chloride` | Number | Chloride content in ppm. |
| Sulfate (SO₄²⁻) | `sulfate` | Number | Sulfate content in ppm. |
| Bicarbonate (HCO₃⁻) | `bicarbonate` | Number | Bicarbonate content in ppm. |

### Target Profile & Salt Additions

| Field | ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Target Style Profile | `water-style-profile` | Select | A predefined water profile to target (e.g., Balanced, Pale Ale). |
| Gypsum | `gypsum` | Number | Grams of Gypsum (CaSO₄·2H₂O) to add. |
| Calcium Chloride | `calcium-chloride` | Number | Grams of Calcium Chloride (CaCl₂) to add. |
| Epsom Salt | `epsom-salt` | Number | Grams of Epsom Salt (MgSO₄·7H₂O) to add. |
| Table Salt | `table-salt` | Number | Grams of Table Salt (NaCl) to add. |

---

## Mash Tab

This tab is for designing and calculating the mash schedule.

### Mash Setup

| Field | ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Mash Type | `mash-type-select` | Select | Loads a template for the mash schedule. Options: `Single Infusion`, `Step Mash`, `Decoction`, `Hochkurz`. |
| Mash Ratio | `mash-ratio` | Number | The ratio of water to grain in quarts per pound (qt/lb). |
| Grain Temperature | `grain-temp` | Number | The starting temperature of the grain in °F. |
| Tun Thermal Mass | `tun-thermal-mass` | Number | A value representing the heat loss of the mash tun in °F. |

### Mash Steps

* **Action**: Click "Add Step" to add a custom mash step, or edit steps from a loaded template.
* **Inputs (per step)**:
  * **Name**: The name of the rest (e.g., Protein Rest, Saccharification).
  * **Temperature**: The target temperature for the step in °F.
  * **Time**: The duration of the step in minutes.
  * **Type**: The type of step (e.g., Infusion, Decoction).

---

## Notes Tab

This tab is for free-form text notes about the recipe.

| Field | ID | Type | Description |
| :--- | :--- | :--- | :--- |
| Recipe Notes | (textarea) | Text Area | A space for detailed brewing notes, observations, or instructions. |
