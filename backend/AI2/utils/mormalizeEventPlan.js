function normalizeEventPlan(plan) {
  let eventPlan = plan;

  // If the plan is still a JSON string, try parsing it
  if (typeof eventPlan === "string") {
    try {
      eventPlan = JSON.parse(eventPlan);
    } catch (err) {
      console.error("❌ Failed to parse personalized event JSON:", err);
      return { name: "", description: "", reasons_for_recommendation: "" };
    }
  }

  // Ensure the simplified schema with safe defaults
  return {
    recommended_events: eventPlan.recommended_events.map(event => ({
      id: event.id || null,
      name: event.name || "",
      description: event.description || "",
      reasons_for_recommendation: event.reasons_for_recommendation || ""
    }))
  };
}

module.exports = { normalizeEventPlan };






















// function normalizeFitnessPlan(plan) {
//   let fitnessPlan = plan;

//   // Flatten nested keys if needed
//   if (fitnessPlan.plan && fitnessPlan.plan.fitness_plan) {
//     fitnessPlan = fitnessPlan.plan.fitness_plan;
//   }

//   // Standardize caloric intake
//   if (fitnessPlan.diet_recommendations?.caloric_intake) {
//     const intakeRange = fitnessPlan.diet_recommendations.caloric_intake.match(/\d+/g);
//     fitnessPlan.diet_recommendations.caloric_intake = {
//       range: intakeRange ? intakeRange.join("-") : "Unknown",
//       unit: "calories",
//       notes: "Adjust based on individual needs and metabolism",
//     };
//   }

//   // Normalize reps
//   fitnessPlan.workout_split?.forEach((day) => {
//     day.exercises.forEach((exercise) => {
//       if (typeof exercise.reps === "string" && exercise.reps.includes("-")) {
//         const [min, max] = exercise.reps.split("-").map(Number);
//         exercise.reps = { min, max };
//       } else if (!isNaN(exercise.reps)) {
//         exercise.reps = { min: Number(exercise.reps), max: Number(exercise.reps) };
//       }
//     });
//   });

//   // Improve warnings format
//   if (Array.isArray(fitnessPlan.warnings)) {
//     fitnessPlan.warnings = fitnessPlan.warnings.map((warning) => ({
//       category: warning.includes("injuries") ? "Injury Prevention" : "General",
//       message: warning,
//     }));
//   }

//   return fitnessPlan;
// }

// module.exports = { normalizeFitnessPlan };
