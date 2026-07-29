const EMAILJS_PUBLIC_KEY = "8z-Z7IsaqiTyqJH-P";
const EMAILJS_SERVICE_ID = "service_lb7vw47";
const EMAILJS_TEMPLATE_ID = "template_ppvxhnk";

emailjs.init(EMAILJS_PUBLIC_KEY);

function sendRegistrationNotification(data) {
  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    full_name: data.fullName,
    email: data.email,
    phone: data.phoneNumber,
    country: data.country,
    referral_source: data.referralSource || "Not specified"
  });
}
