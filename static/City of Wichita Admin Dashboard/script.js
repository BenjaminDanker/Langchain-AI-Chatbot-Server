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

const isDark = document.body.classList.contains('theme-midnight');
const chartTextColor = isDark ? '#ffffff' : '#333333';
const chartBgColor = isDark ? '#5cb4ff' : '#0047AB';


backgroundColor: isDark
? ["#5cb4ff", "#00e0ff", "#ffc107", "#28a745", "#ff6b6b"]
: ["#0047AB", "#008CFF", "#ffaa00", "#28a745", "#dc3545"]

// Chart: Population Growth
new Chart(document.getElementById('populationChart'), {
  type: 'bar',
  data: {
    
    labels: ["2019", "2020", "2021", "2022", "2023"],
    datasets: [{
      label: "Population",
      data: [185000, 295000, 355000, 400000, 425000],
      backgroundColor: chartBgColor

    }]
    
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: chartTextColor
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: chartTextColor
        }
      },
      y: {
        ticks: {
          color: chartTextColor,
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


function showDashboardTab(tabId) {
  const allSections = document.querySelectorAll('.dashboard-section');
  allSections.forEach(sec => sec.style.display = 'none');

  const target = document.getElementById(tabId);
  if (target) {
    target.style.display = 'block';
  }
}

// Queries Per Day
new Chart(document.getElementById("queriesChart"), {
type: "line",
data: {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [{
    label: "Queries",
    data: [120, 150, 130, 170, 190, 140, 110],
    borderColor: "#3498db",
    fill: false,
    tension: 0.3
  }]
},
options: { responsive: true }
});

// Average Response Time
new Chart(document.getElementById("responseTimeChart"), {
type: "line",
data: {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [{
    label: "Avg Response (s)",
    data: [4.2, 3.9, 3.5, 3.2],
    borderColor: "#e67e22",
    fill: false,
    tension: 0.3
  }]
},
options: { responsive: true }
});

// Performance Trend
new Chart(document.getElementById("performanceChart"), {
type: "line",
data: {
  labels: ["Jan", "Feb", "Mar", "Apr"],
  datasets: [{
    label: "Performance",
    data: [78, 83, 87, 92],
    borderColor: "#2ecc71",
    fill: false,
    tension: 0.3
  }]
},
options: { responsive: true }
});

// Top Queries
new Chart(document.getElementById("topQueriesChart"), {
type: "bar",
data: {
  labels: ["Water Bill", "Trash Pickup", "Job Openings", "Permit", "Events"],
  datasets: [{
    label: "Query Count",
    data: [45, 38, 34, 21, 18],
    backgroundColor: "#9b59b6"
  }]
},
options: { responsive: true, indexAxis: 'y' }
});


function setTheme(themeName) {
document.body.classList.remove('theme-blue', 'theme-teal', 'theme-midnight');
document.body.classList.add('theme-' + themeName);
localStorage.setItem('dashboardTheme', themeName);
}

window.addEventListener('DOMContentLoaded', () => {
const savedTheme = localStorage.getItem('dashboardTheme') || 'blue';
setTheme(savedTheme);
});
