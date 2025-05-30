// === Cleaned & Finalized FAQ Manager JavaScript ===

const staticFaqs = [
  {
    question: "How do I apply for a city permit?",
    answer: "You can apply for permits online via the city portal under the Permits section.",
    category: "City Services"
  },
  {
    question: "How can I pay my water bill?",
    answer: "Water bills can be paid online, by mail, or in person at City Hall.",
    category: "Utilities"
  },
  {
    question: "Where can I find city event updates?",
    answer: "Visit the Events section on the homepage or follow our social media channels.",
    category: "Events"
  }
];

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
      x: { ticks: { color: chartTextColor } },
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
  alert("You have been logged out.");
  window.location.href = "login.html";
}

function showDashboardTab(tabId) {
  const allSections = document.querySelectorAll('.dashboard-section');
  allSections.forEach(sec => sec.style.display = 'none');
  const target = document.getElementById(tabId);
  if (target) target.style.display = 'block';
}

function setTheme(themeName) {
  document.body.classList.remove('theme-blue', 'theme-teal', 'theme-midnight');
  document.body.classList.add('theme-' + themeName);
  localStorage.setItem('dashboardTheme', themeName);
}

// Load FAQs from localStorage
function loadFaqsFromStorage() {
  const storedFaqs = localStorage.getItem("cityFaqs");
  return storedFaqs ? JSON.parse(storedFaqs) : [];
}

// Save FAQs to localStorage
function saveFaqsToStorage(faqs) {
  localStorage.setItem("cityFaqs", JSON.stringify(faqs));
}

// Render FAQs

function renderFaqList() {
  const faqList = document.getElementById("faqList");
  const search = document.getElementById("faqSearch").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const faqs = loadFaqsFromStorage();

  faqList.innerHTML = "";

  faqs.forEach((faq, index) => {
    const matchesCategory = category === "all" || faq.category === category;
    const matchesSearch = faq.question.toLowerCase().includes(search) || faq.answer.toLowerCase().includes(search);

    if (matchesCategory && matchesSearch) {
      const div = document.createElement("div");
      div.className = "faq-item";
      div.setAttribute("data-category", faq.category);
      div.innerHTML = `
  <div class="faq-top">
    <div class="faq-question" onclick="toggleAnswer(this)">${faq.question}</div>
    <div class="faq-actions-inline">
      
      <button class="edit-btn" onclick="event.stopPropagation(); editFaq(${index})">Edit</button>
      <button class="delete-btn" onclick="event.stopPropagation(); deleteFaq(${index})">Delete</button>
      <span class="faq-feedback-inline">Was this helpful?
        <button onclick="event.stopPropagation(); markHelpful(this)">Yes</button>
        <button onclick="event.stopPropagation();">No</button>
      </span>
      </div>
  </div>
  <div class="faq-answer">${faq.answer}</div>
  
`;

      faqList.appendChild(div);
    }
  });
}

function toggleAnswer(el) {
  const parent = el.closest(".faq-item");
  const answer = parent.querySelector(".faq-answer");
  const feedback = parent.querySelector(".faq-feedback");

  // Collapse all others
  document.querySelectorAll('.faq-answer').forEach(a => {
    if (a !== answer) a.classList.remove('active');
  });
  document.querySelectorAll('.faq-feedback').forEach(f => {
    if (f !== feedback) f.classList.remove('active');
  });

  // Toggle current
  const isVisible = answer.classList.contains("active");
  answer.classList.toggle("active", !isVisible);
  feedback.classList.toggle("hidden", !answer.classList.contains("active"));
}



function filterFAQs() {
  const searchTerm = document.getElementById('faqSearch').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(faq => {
    const matchesSearch = faq.textContent.toLowerCase().includes(searchTerm);
    const matchesCategory = category === 'all' || faq.dataset.category === category;
    faq.style.display = (matchesSearch && matchesCategory) ? 'block' : 'none';
  });
}

function deleteFaq(index) {
  if (confirm("Are you sure you want to delete this FAQ?")) {
    const faqs = loadFaqsFromStorage();
    faqs.splice(index, 1);
    saveFaqsToStorage(faqs);
    renderFaqList();
  }
}

function editFaq(index) {
  const faqs = loadFaqsFromStorage();
  const faq = faqs[index];

  // Populate the glass form with existing data
  document.getElementById("glassFaqQuestion").value = faq.question;
  document.getElementById("glassFaqAnswer").value = faq.answer;
  document.getElementById("glassFaqCategory").value = faq.category;

  // Show the glass form
  document.getElementById("glassFaqForm").classList.remove("hidden");

  // Overwrite the Save button to update instead of adding a new FAQ
  const saveBtn = document.querySelector("#glassFaqForm .glass-faq-actions button:first-child");
  saveBtn.onclick = function () {
    const updatedQuestion = document.getElementById("glassFaqQuestion").value.trim();
    const updatedAnswer = document.getElementById("glassFaqAnswer").value.trim();
    const updatedCategory = document.getElementById("glassFaqCategory").value;

    if (updatedQuestion && updatedAnswer) {
      faqs[index] = {
        question: updatedQuestion,
        answer: updatedAnswer,
        category: updatedCategory,
      };

      saveFaqsToStorage(faqs);
      renderFaqList();
      document.getElementById("glassFaqForm").classList.add("hidden");
    } else {
      alert("Please fill out both question and answer.");
    }
  };
}

function toggleFaqForm() {
  document.getElementById("inlineFaqForm").classList.toggle("hidden");
}


function saveNewFaq() {
  const q = document.getElementById("newFaqQuestion").value.trim();
  const a = document.getElementById("newFaqAnswer").value.trim();
  const c = document.getElementById("newFaqCategory").value;

  if (q && a) {
    const faqs = loadFaqsFromStorage();
    faqs.push({ question: q, answer: a, category: c });
    saveFaqsToStorage(faqs);
    renderFaqList();
    toggleAddFaq();
  } else {
    alert("Please fill out both question and answer.");
  }
}

function toggleGlassFaq() {
  const form = document.getElementById("glassFaqForm");
  const isHidden = form.classList.contains("hidden");

  if (isHidden) {
    // Reset fields
    document.getElementById("glassFaqQuestion").value = "";
    document.getElementById("glassFaqAnswer").value = "";
    document.getElementById("glassFaqCategory").value = "City Services";

    // Reset save button to default add function
    document.querySelector("#glassFaqForm .glass-faq-actions button:first-child").onclick = saveGlassFaq;
  }

  form.classList.toggle("hidden");
}


function saveGlassFaq() {
  const q = document.getElementById("glassFaqQuestion").value.trim();
  const a = document.getElementById("glassFaqAnswer").value.trim();
  const c = document.getElementById("glassFaqCategory").value;

  if (q && a) {
    const faqs = loadFaqsFromStorage();
    faqs.push({ question: q, answer: a, category: c });
    saveFaqsToStorage(faqs);
    renderFaqList();
    toggleGlassFaq();

    // Clear form fields
    document.getElementById("glassFaqQuestion").value = "";
    document.getElementById("glassFaqAnswer").value = "";
    document.getElementById("glassFaqCategory").value = "City Services";
  } else {
    alert("Please fill out both question and answer.");
  }
}

function markHelpful(btn) {
  btn.textContent = "✔️ Thank you!";
  btn.disabled = true;
}

window.addEventListener("DOMContentLoaded", () => {
  renderFaqList();
  document.getElementById("faqSearch").addEventListener("input", renderFaqList);
  document.getElementById("categoryFilter").addEventListener("change", renderFaqList);
});

// Departments //

// =======================
// Department Management
// =======================

let editIndex = null;

function openDeptModal(index = null) {
  const modal = document.getElementById("glassDeptForm");
  modal.classList.remove("hidden");

  if (index !== null) {
    const depts = getDepartments();
    const d = depts[index];
    document.getElementById("deptName").value = d.name;
    document.getElementById("deptHead").value = d.head;
    document.getElementById("deptEmail").value = d.email;
    document.getElementById("deptPhone").value = d.phone;
    document.getElementById("deptLocation").value = d.location;
    document.getElementById("deptHours").value = d.hours;
    document.getElementById("deptCategory").value = d.category;
    document.getElementById("deptTagline").value = d.tagline;
    document.getElementById("deptKeywords").value = d.keywords;
    document.getElementById("deptStatus").value = d.status;
    editIndex = index;
  } else {
    clearDeptModal();
    editIndex = null;
  }
}

function closeDeptModal() {
  document.getElementById("glassDeptForm").classList.add("hidden");
  clearDeptModal();
}

function toggleDeptForm() {
  const modal = document.getElementById("glassDeptForm");
  modal.classList.toggle("hidden");
  if (modal.classList.contains("hidden")) clearDeptModal();
}

function clearDeptModal() {
  document.querySelectorAll('#glassDeptForm input, #glassDeptForm select').forEach(el => el.value = '');
}

function getDepartments() {
  return JSON.parse(localStorage.getItem("departments")) || [];
}

function saveDepartment() {
  const name = document.getElementById("deptName").value.trim();
  const head = document.getElementById("deptHead").value.trim();
  const email = document.getElementById("deptEmail").value.trim();

  if (!name || !head || !email) {
    alert("Please fill in required fields.");
    return;
  }

  const deptData = {
    name,
    head,
    email,
    phone: document.getElementById("deptPhone").value.trim(),
    location: document.getElementById("deptLocation").value.trim(),
    hours: document.getElementById("deptHours").value.trim(),
    category: document.getElementById("deptCategory").value,
    tagline: document.getElementById("deptTagline").value.trim(),
    keywords: document.getElementById("deptKeywords").value.trim(),
    status: document.getElementById("deptStatus").value
  };

  const departments = getDepartments();

  if (editIndex !== null) {
    departments[editIndex] = deptData;
    editIndex = null;
  } else {
    departments.push(deptData);
  }

  localStorage.setItem("departments", JSON.stringify(departments));
  toggleDeptForm();
  renderDepartments();
}

function deleteDepartment(index) {
  if (confirm("Are you sure you want to delete this department?")) {
    const departments = getDepartments();
    departments.splice(index, 1);
    localStorage.setItem("departments", JSON.stringify(departments));
    renderDepartments();
  }
}

function renderDepartments() {
  const list = document.getElementById("departmentList");
  const departments = getDepartments();
  const query = document.getElementById("deptSearch").value.toLowerCase();

  list.innerHTML = "";

  departments.forEach((dept, index) => {
    const combinedText = `${dept.name} ${dept.head} ${dept.email} ${dept.category} ${dept.status}`.toLowerCase();
    if (combinedText.includes(query)) {
      const card = document.createElement("div");
      card.className = "department-card";
      card.innerHTML = `
        <h4>${dept.name}</h4>
        <p><strong>Head:</strong> ${dept.head}</p>
        <p><strong>Email:</strong> ${dept.email}</p>
        <p><strong>Phone:</strong> ${dept.phone || "N/A"}</p>
        <p><strong>Location:</strong> ${dept.location || "N/A"}</p>
        <p><strong>Hours:</strong> ${dept.hours || "N/A"}</p>
        <p><strong>Category:</strong> ${dept.category}</p>
        <p><strong>Tagline:</strong> ${dept.tagline}</p>
        <p><strong>Keywords:</strong> ${dept.keywords}</p>
        <span class="dept-status">${dept.status}</span>
        <div class="dept-actions">
          <button class="edit" onclick="openDeptModal(${index})">Edit</button>
          <button class="delete" onclick="deleteDepartment(${index})">Delete</button>
        </div>`;
      list.appendChild(card);
    }
  });
}

// === Search Functionality ===
document.getElementById("deptSearch").addEventListener("input", renderDepartments);

// === Load Departments on Page Load ===
window.addEventListener("DOMContentLoaded", () => {
  renderDepartments();
});


// **** chat logs **** //

const chatLogs = [
  {
    userId: "User123",
    date: "2025-05-14",
    department: "Utilities",
    sentiment: "Neutral",
    fullChat: [
      { sender: "User", text: "Hi, I need help paying my water bill." },
      { sender: "Bot", text: "You can pay online, by mail, or in person." },
      { sender: "User", text: "Thanks!" }
    ]
  },
  // more logs...
];

let logs = JSON.parse(localStorage.getItem("chatLogs")) || [];

function renderChatLogs() {
  const container = document.getElementById("chatLogsContainer");
  const search = document.getElementById("chatSearch").value.toLowerCase();
  const dept = document.getElementById("deptFilter").value;
  const sentiment = document.getElementById("sentimentFilter").value;

  container.innerHTML = "";

  logs.forEach((log, index) => {
    const matchSearch = log.userId.toLowerCase().includes(search) ||
      log.fullChat.some(msg => msg.text.toLowerCase().includes(search));
    const matchDept = dept === "All" || log.department === dept;
    const matchSentiment = sentiment === "All" || log.sentiment === sentiment;

    if (matchSearch && matchDept && matchSentiment) {
      const div = document.createElement("div");
      div.className = "chat-card";
      div.innerHTML = `
        <h4>${log.department} - ${log.userId}</h4>
        <div class="chat-meta">Date: ${log.date} | Sentiment: ${log.sentiment}</div>
        <button onclick="toggleChat(${index})">View Full Chat</button>
        <div class="full-chat" id="chat-${index}">
          ${log.fullChat.map(msg => `<p><strong>${msg.sender}:</strong> ${msg.text}</p>`).join("")}
        </div>
      `;
      container.appendChild(div);
    }
  });
}
 
function toggleChat(index) {
  const chatBox = document.getElementById(`chat-${index}`);
  chatBox.style.display = chatBox.style.display === "block" ? "none" : "block";
}

function exportChatLogs() {
  const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "chat_logs.json";
  link.click();
}

document.getElementById("chatSearch").addEventListener("input", renderChatLogs);
document.getElementById("deptFilter").addEventListener("change", renderChatLogs);
document.getElementById("sentimentFilter").addEventListener("change", renderChatLogs);

window.addEventListener("DOMContentLoaded", renderChatLogs);


// DASHBOARD SECTION
function showDashboardTab(tabId) {
  // Hide all content sections
  const allSections = document.querySelectorAll('.dashboard-section');
  allSections.forEach(sec => sec.style.display = 'none');

  // Show the selected section
  const target = document.getElementById(tabId);
  if (target) target.style.display = 'block';

  // Remove active class from all buttons
  const allButtons = document.querySelectorAll('.dashboard-tabs button');
  allButtons.forEach(btn => btn.classList.remove('active-tab'));

  // Match and apply active-tab class
  const clickedBtn = Array.from(allButtons).find(btn =>
    btn.textContent.toLowerCase().includes(tabId.split(" ")[0].toLowerCase())
  );
  if (clickedBtn) {
    clickedBtn.classList.add('active-tab');
  }
}


window.addEventListener("DOMContentLoaded", () => {
  renderFaqList(); // if FAQ logic exists
  renderDepartments(); // if department logic exists
  showDashboardTab('engagement'); // Default tab visible
});


