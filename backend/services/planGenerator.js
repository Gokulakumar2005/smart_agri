const getCropSuitabilitySummary = (crop, soilType) => {
  const suitable = crop.suitableSoilTypes.includes(soilType);
  if (suitable) {
    return `Excellent fit for ${soilType} soil. ${crop.name} is well suited to the selected soil profile and irrigation setup.`;
  }
  return `${crop.name} is moderately suitable for ${soilType}. Consider amending soil or adjusting irrigation to improve crop performance.`;
};

const buildCultivationPlan = (crop, options) => {
  const plantingDate = new Date(options.plantingDate);
  const expectedHarvestDate = new Date(plantingDate);
  expectedHarvestDate.setDate(expectedHarvestDate.getDate() + crop.growthDurationDays);

  const fertilizerSchedule = crop.fertilizerSchedule
    .filter((item) => {
      if (options.farmingPractice === 'organic') {
        return item.organicAlternative;
      }
      return true;
    })
    .map((item) => ({
      ...item,
      nutrient: item.nutrient || 'General nutrient mix',
      conventionalInput: options.farmingPractice === 'organic' ? item.organicAlternative : item.conventionalInput,
      organicAlternative: item.organicAlternative,
    }));

  const irrigationSchedule = crop.irrigationSchedule.map((item) => ({
    ...item,
    notes: `${item.notes} (${options.irrigationMethod} irrigation method)`,
  }));

  return {
    suitabilitySummary: getCropSuitabilitySummary(crop, options.soilType),
    landPreparation: crop.landPreparation,
    fertilizerSchedule,
    irrigationSchedule,
    maintenanceSchedule: crop.maintenanceSchedule,
    expectedHarvestDate: expectedHarvestDate.toISOString(),
  };
};

module.exports = { buildCultivationPlan };
