// Redirect Login to Microsoft Authenticator
document.getElementById("loginForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    document.getElementById("message").innerText = "Redirecting to Microsoft Authenticator...";
   
    setTimeout(() => {
        window.location.href = "https://login.microsoftonline.com";
    }, 2000);
});
 
// Password Strength Checker
function checkPasswordStrength() {
    let password = document.getElementById("new-password").value;
    let strengthMessage = document.getElementById("password-strength");
 
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[@$!%*?&]/)) strength++;
 
    let strengthText;
    switch(strength) {
        case 5: strengthText = "Strong 💪"; strengthMessage.style.color = "green"; break;
        case 4: strengthText = "Moderate 👍"; strengthMessage.style.color = "orange"; break;
        case 3: strengthText = "Weak 😟"; strengthMessage.style.color = "red"; break;
        default: strengthText = "Very Weak ❌"; strengthMessage.style.color = "darkred";
    }
 
    strengthMessage.innerText = `Password Strength: ${strengthText}`;
}