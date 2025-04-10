function showSection(id) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
 
  function handleSearch() {
    alert("Search function triggered!");
  }
 
  function applyDropdownFilter() {
    const value = document.getElementById("filterSelect").value;
    const output = document.getElementById("selectedFilterDisplay");
    if (output) {
      output.textContent = "Currently showing: " + value.replace(/([A-Z])/g, ' $1');
    }
    console.log("Filtered by:", value);
  }
 
  // Chart: Population Growth
  new Chart(document.getElementById('populationChart'), {
    type: 'bar',
    data: {
      labels: ["2019", "2020", "2021", "2022", "2023"],
      datasets: [{
        label: "Population",
        data: [185000, 295000, 355000, 400000, 425000],
        backgroundColor: "#0047AB"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            callback: function(val) {
              return val.toLocaleString();
            }
          }
        }
      }
    }
  });
 
  // Chart: Budget Allocation
  new Chart(document.getElementById('budgetChart'), {
    type: 'pie',
    data: {
      labels: ["Infrastructure", "Education", "Public Safety", "Health", "Parks"],
      datasets: [{
        data: [30, 25, 20, 15, 10],
        backgroundColor: ["#0047AB", "#008CFF", "#ffaa00", "#28a745", "#dc3545"]
      }]
    }, 
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
  function handleLogout() {
    // Optionally clear local storage, show alert, etc.
    alert("You have been logged out.");
    window.location.href = "login.html"; // Or your login page route
  }
 
 
 