const addPatientMedicineForm = document.getElementById(
  "addPatientMedicineFormId"
);
const closeAddPatientMedicineButton = document.getElementById(
  "closeAddPatientMedicineButtonId"
);
const addPatientMedicineSelect = document.getElementById(
  "addPatientMedicineSelectId"
);
const addPatientMedicineAmount = document.getElementById(
  "addPatientMedicineAmountId"
);
const submitAddPatientMedicineButton = document.getElementById(
  "submitAddPatientMedicineButtonId"
);
const addPatientMedicineCategorySelect = document.getElementById(
  "addPatientMedicineCategorySelectId"
);

var params = {};

addPatientMedicineCategorySelect.addEventListener("change", fillMedicineSelect);

function fillMedicineSelect() {
  params.categoryId =
    addPatientMedicineCategorySelect.options[
      addPatientMedicineCategorySelect.selectedIndex
    ].value;
  loadMedicineSelectOptions(addPatientMedicineSelect, params);
}

async function submitAddPatientMedicine(patientId, visitId) {
  const amount = parseInt(addPatientMedicineAmount.value.trim(), 10);

  if (addPatientMedicineSelect.selectedIndex === -1) {
    return alert("الدواء فارغ");
  }

  if (isNaN(amount) || amount <= 0) {
    return alert("الكمية غير صحيحة");
  }

  const medicineId =
    addPatientMedicineSelect.options[addPatientMedicineSelect.selectedIndex]
      .value;

  try {
    const response = await axios.get(`/api/medicine/${medicineId}`);
    const data = response.data.data;
    const availableAmount = data.total_amount - data.used_amount;

    if (amount > availableAmount) {
      return alert("الكمية المطلوبة أكبر من المتاحة");
    }

    await axios.post("/api/patients/medicine", {
      patientId,
      visitId,
      medicineId,
      amount,
    });
  } catch (error) {
    handleError(error);
  }
}

function handleError(error) {
  alert(error.response.data.message);
}
