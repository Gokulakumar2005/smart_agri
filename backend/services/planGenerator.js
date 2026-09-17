const landPreparationDefaults = {
  Paddy: [
    'Test soil pH and nutrients, then incorporate 2-4 tonnes of well-decomposed farmyard manure per acre.',
    'Plough and puddle the field, level it properly, and maintain drainage channels before transplanting.',
    'Apply the recommended basal phosphorus and potassium only after a soil test; keep the seedbed weed-free.',
  ],
  Banana: [
    'Test soil and prepare pits about 60 cm wide and deep with well-decomposed compost and topsoil.',
    'Ensure good drainage and add neem cake to the pit mixture where soil pest pressure is common.',
    'Plant only healthy suckers or tissue-culture plants and install drip irrigation before planting.',
  ],
  Tomato: [
    'Test soil pH and nutrients, form raised beds, and incorporate well-decomposed compost before transplanting.',
    'Apply a soil-test-based basal phosphorus and potassium dose, then prepare firm beds with drainage channels.',
    'Install drip lines and add mulch after transplanting to reduce moisture stress and nutrient loss.',
  ],
};

const soilHealthPreparation = [
  '2-3 weeks before planting, test soil pH, organic carbon, nitrogen, phosphorus, potassium, and salinity; use the results to set amendment rates.',
  'Remove weeds and crop residues, loosen compacted soil, and incorporate 2-4 tonnes per acre of mature compost or farmyard manure without using fresh manure.',
  'Correct pH only from the soil-test recommendation: use agricultural lime for strongly acidic soil or gypsum where sodicity is confirmed; do not apply either blindly.',
  'Improve biological activity with mature compost, retain suitable crop residues as mulch, and provide drainage so roots receive air as well as water.',
];

const fertilizerDefaults = {
  Paddy: [
    { stage: 'Basal before transplanting', daysFromPlanting: 0, nutrient: 'Organic matter + phosphorus', conventionalInput: 'Farmyard manure 2-4 tonnes/acre plus SSP as recommended by soil test', organicAlternative: 'Compost 2-4 tonnes/acre plus rock phosphate as recommended by soil test', notes: 'Incorporate before puddling; do not apply blindly without a soil test.' },
    { stage: 'Early tillering', daysFromPlanting: 25, nutrient: 'Nitrogen', conventionalInput: 'Urea split dose as recommended by soil test, commonly 20-25 kg/acre', organicAlternative: 'Well-matured compost or vermicompost in a split application', notes: 'Apply on drained soil and irrigate afterward.' },
    { stage: 'Panicle initiation', daysFromPlanting: 65, nutrient: 'Nitrogen + potassium', conventionalInput: 'Urea and MOP split dose as recommended by soil test', organicAlternative: 'Compost tea with approved organic potassium source', notes: 'Supports grain filling; avoid excess nitrogen.' },
  ],
  Banana: [
    { stage: 'Pit preparation', daysFromPlanting: 0, nutrient: 'Organic matter + phosphorus', conventionalInput: 'Compost 10 kg/pit plus SSP as recommended by soil test', organicAlternative: 'Well-decomposed farmyard manure 10 kg/pit plus neem cake', notes: 'Mix thoroughly with soil before planting.' },
    { stage: 'Vegetative growth', daysFromPlanting: 60, nutrient: 'Nitrogen', conventionalInput: 'Urea split dose as recommended by soil test', organicAlternative: 'Vermicompost 2-3 kg/plant in split doses', notes: 'Apply around the wetted root zone, away from the pseudostem.' },
    { stage: 'Flowering and fruit filling', daysFromPlanting: 180, nutrient: 'Potassium', conventionalInput: 'MOP split dose as recommended by soil test', organicAlternative: 'Approved organic potassium source and compost', notes: 'Adequate potassium supports bunch development and fruit quality.' },
  ],
  Tomato: [
    { stage: 'Basal before transplanting', daysFromPlanting: 0, nutrient: 'Organic matter + phosphorus', conventionalInput: 'Compost 2-4 tonnes/acre plus SSP as recommended by soil test', organicAlternative: 'Compost plus bone meal or rock phosphate as permitted', notes: 'Mix into the topsoil before transplanting.' },
    { stage: 'Flowering', daysFromPlanting: 35, nutrient: 'Nitrogen + potassium', conventionalInput: 'Water-soluble NPK through drip as recommended by soil test', organicAlternative: 'Vermicompost side dressing and approved organic liquid feed', notes: 'Use split doses to reduce leaching and support flowering.' },
    { stage: 'Fruit setting', daysFromPlanting: 65, nutrient: 'Potassium + calcium', conventionalInput: 'MOP and gypsum only at soil-test-recommended rates', organicAlternative: 'Compost with approved calcium amendment', notes: 'Maintain even irrigation to reduce blossom-end rot.' },
  ],
};

const addApplicationDate = (plantingDate, item) => {
  const applicationDate = new Date(plantingDate);
  applicationDate.setDate(applicationDate.getDate() + (item.daysFromPlanting || 0));
  return { ...item, applicationDate: applicationDate.toISOString() };
};

const irrigationMethodGuidance = {
  Drip: {
    frequency: 'Use short, frequent irrigation cycles; check root-zone moisture daily.',
    notes: 'Prefer early morning or late afternoon watering and avoid standing water.'
  },
  Sprinkler: {
    frequency: 'Water every 2-3 days, adjusting for rainfall and soil moisture.',
    notes: 'Use early morning irrigation so leaves dry quickly and disease risk stays lower.'
  },
  Flood: {
    frequency: 'Irrigate every 3-5 days, allowing the soil surface to partly dry between applications.',
    notes: 'Use field channels carefully and avoid prolonged waterlogging.'
  },
};

const getCropSuitabilitySummary = (crop, soilType) => {
  const suitable = crop.suitableSoilTypes.includes(soilType);
  if (suitable) {
    return `Excellent fit for ${soilType} soil. ${crop.name} is well suited to the selected soil profile and irrigation setup.`;
  }
  return `${crop.name} is moderately suitable for ${soilType}. Consider amending soil or adjusting irrigation to improve crop performance.`;
};

const buildDailyTasks = (plantingDate, generatedPlan) => {
  const tasks = soilHealthPreparation.map((step, index) => {
    const dueDate = new Date(plantingDate);
    dueDate.setDate(dueDate.getDate() - (21 - index * 5));
    return { title: 'Improve soil health before planting', category: 'land', dueDate: dueDate.toISOString(), details: step, completed: false };
  });

  generatedPlan.fertilizerSchedule.forEach((item) => {
    const dueDate = item.applicationDate || addApplicationDate(plantingDate, item).applicationDate;
    tasks.push({
    title: `Apply ${item.nutrient} fertilizer: ${item.stage}`,
    category: 'fertilizer',
    dueDate,
    details: item.conventionalInput,
    completed: false,
    });
  });
  generatedPlan.irrigationSchedule.forEach((item) => {
    const irrigationDate = item.irrigationDate || addApplicationDate(plantingDate, item).applicationDate;
    tasks.push({
    title: `Irrigate during ${item.stage}`,
    category: 'irrigation',
    dueDate: irrigationDate,
    details: `${item.frequency} ${item.notes}`,
    completed: false,
    });
  });
  generatedPlan.maintenanceSchedule?.forEach((item) => {
    const dueDate = new Date(plantingDate);
    dueDate.setDate(dueDate.getDate() + (item.daysFromPlanting || 0));
    tasks.push({ title: item.task, category: 'maintenance', dueDate: dueDate.toISOString(), details: item.stage, completed: false });
  });
  return tasks.sort((first, second) => new Date(first.dueDate) - new Date(second.dueDate));
};

const buildCultivationPlan = (crop, options) => {
  const plantingDate = new Date(options.plantingDate);
  const expectedHarvestDate = new Date(plantingDate);
  expectedHarvestDate.setDate(expectedHarvestDate.getDate() + crop.growthDurationDays);

  const fertilizerItems = crop.fertilizerSchedule?.length ? crop.fertilizerSchedule : fertilizerDefaults[crop.name] || [];
  const fertilizerSchedule = fertilizerItems
    .filter((item) => {
      if (options.farmingPractice === 'organic') {
        return item.organicAlternative;
      }
      return true;
    })
    .map((item) => addApplicationDate(plantingDate, {
      ...item,
      nutrient: item.nutrient || 'General nutrient mix',
      conventionalInput: options.farmingPractice === 'organic' ? item.organicAlternative : item.conventionalInput,
      organicAlternative: item.organicAlternative,
    }));

  const irrigationItems = crop.irrigationSchedule?.length ? crop.irrigationSchedule : [
    { stage: 'Establishment', daysFromPlanting: 7, frequency: 'Check soil moisture before watering.', notes: 'Keep the root zone evenly moist after planting.' },
    { stage: 'Active growth', daysFromPlanting: Math.round(crop.growthDurationDays * 0.45), frequency: 'Adjust irrigation to crop demand and rainfall.', notes: 'Do not let the root zone dry completely.' },
    { stage: 'Pre-harvest', daysFromPlanting: Math.max(crop.growthDurationDays - 15, 1), frequency: 'Reduce irrigation as the crop approaches harvest.', notes: 'Avoid excess water close to harvest.' },
  ];
  const methodGuidance = irrigationMethodGuidance[options.irrigationMethod] || irrigationMethodGuidance.Drip;
  const irrigationSchedule = irrigationItems.map((item) => {
    const irrigationDate = new Date(plantingDate);
    irrigationDate.setDate(irrigationDate.getDate() + (item.daysFromPlanting || 0));
    return {
      ...item,
      irrigationDate: irrigationDate.toISOString(),
      frequency: `${item.frequency} ${methodGuidance.frequency}`,
      notes: `${item.notes} ${methodGuidance.notes} (${options.irrigationMethod} irrigation method)`,
    };
  });

  const generatedPlan = {
    suitabilitySummary: getCropSuitabilitySummary(crop, options.soilType),
    landPreparation: Array.from(new Set([
      ...soilHealthPreparation,
      ...(crop.landPreparation?.length ? crop.landPreparation : landPreparationDefaults[crop.name] || ['Clear weeds, loosen the soil, incorporate mature organic matter, and prepare drainage before planting.']),
    ])),
    fertilizerSchedule,
    irrigationSchedule,
    maintenanceSchedule: crop.maintenanceSchedule,
    expectedHarvestDate: expectedHarvestDate.toISOString(),
  };
  return { ...generatedPlan, tasks: buildDailyTasks(plantingDate, generatedPlan) };
};

export { buildCultivationPlan, buildDailyTasks };
