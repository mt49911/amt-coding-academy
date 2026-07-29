document.addEventListener("DOMContentLoaded", function () {

  if (window.AOS) {
    AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
  }

  const COUNTRIES = [
    { name: "Nigeria", flag: "🇳🇬", code: "+234" },
    { name: "Ghana", flag: "🇬🇭", code: "+233" },
    { name: "Niger", flag: "🇳🇪", code: "+227" },
    { name: "Cameroon", flag: "🇨🇲", code: "+237" },
    { name: "Chad", flag: "🇹🇩", code: "+235" },
    { name: "Benin", flag: "🇧🇯", code: "+229" },
    { name: "Togo", flag: "🇹🇬", code: "+228" },
    { name: "Senegal", flag: "🇸🇳", code: "+221" },
    { name: "Kenya", flag: "🇰🇪", code: "+254" },
    { name: "South Africa", flag: "🇿🇦", code: "+27" },
    { name: "Egypt", flag: "🇪🇬", code: "+20" },
    { name: "Sudan", flag: "🇸🇩", code: "+249" },
    { name: "Saudi Arabia", flag: "🇸🇦", code: "+966" },
    { name: "United Arab Emirates", flag: "🇦🇪", code: "+971" },
    { name: "United Kingdom", flag: "🇬🇧", code: "+44" },
    { name: "United States", flag: "🇺🇸", code: "+1" },
    { name: "Canada", flag: "🇨🇦", code: "+1" },
    { name: "Malaysia", flag: "🇲🇾", code: "+60" },
    { name: "Turkey", flag: "🇹🇷", code: "+90" },
    { name: "India", flag: "🇮🇳", code: "+91" },
    { name: "Qatar", flag: "🇶🇦", code: "+974" },
    { name: "Other", flag: "🌍", code: "+" }
  ];

  const countrySelect = document.getElementById("countrySelect");
  COUNTRIES.forEach(function (c) {
    const opt = document.createElement("option");
    opt.value = c.code;
    opt.dataset.country = c.name;
    opt.textContent = c.flag + " " + c.name + " (" + c.code + ")";
    countrySelect.appendChild(opt);
  });
  countrySelect.value = "+234";

  const form = document.getElementById("registerForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnSpinner = submitBtn.querySelector(".btn-spinner");
  const successModal = document.getElementById("successModal");

  function showError(fieldId, show) {
    const errEl = document.getElementById("err-" + fieldId);
    const inputEl = document.getElementById(fieldId);
    if (errEl) errEl.classList.toggle("show", show);
    if (inputEl) inputEl.classList.toggle("invalid", show);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    return /^[0-9]{6,12}$/.test(value.replace(/\s/g, ""));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phoneRaw = document.getElementById("phone").value.trim();
    const consent = document.getElementById("consent").checked;
    const referral = document.getElementById("referral").value;
    const selectedOption = countrySelect.options[countrySelect.selectedIndex];
    const dialCode = countrySelect.value;
    const countryName = selectedOption.dataset.country;

    let valid = true;
    showError("fullName", fullName.length < 2); if (fullName.length < 2) valid = false;
    showError("email", !isValidEmail(email)); if (!isValidEmail(email)) valid = false;
    showError("phone", !isValidPhone(phoneRaw)); if (!isValidPhone(phoneRaw)) valid = false;
    showError("consent", !consent); if (!consent) valid = false;

    if (!valid) return;

    const fullPhoneNumber = dialCode + phoneRaw.replace(/\s/g, "");

    const registrationData = {
      fullName: fullName,
      email: email,
      phoneNumber: fullPhoneNumber,
      country: countryName,
      countryCode: dialCode,
      referralSource: referral
    };

    submitBtn.disabled = true;
    btnText.style.display = "none";
    btnSpinner.style.display = "inline-flex";

    Promise.all([
      saveRegistrationToFirestore(registrationData),
      sendRegistrationNotification(registrationData)
    ])
      .then(function () {
        form.reset();
        countrySelect.value = "+234";
        successModal.classList.add("active");
      })
      .catch(function (err) {
        console.error("Registration error:", err);
        alert("Something went wrong while submitting your registration. Please check your connection and try again.");
      })
      .finally(function () {
        submitBtn.disabled = false;
        btnText.style.display = "inline";
        btnSpinner.style.display = "none";
      });
  });

  ["fullName", "email", "phone", "consent"].forEach(function (id) {
    const el = document.getElementById(id);
    const evt = id === "consent" ? "change" : "input";
    el.addEventListener(evt, function () { showError(id, false); });
  });
});
